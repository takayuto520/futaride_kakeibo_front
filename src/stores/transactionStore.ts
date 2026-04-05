import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction } from "@/types/Transaction.type";
import {
  createTransaction,
  deleteTransaction as deleteTransactionApi,
  fetchTransactions as fetchTransactionsApi,
  updateTransaction as updateTransactionApi,
} from "@/services/transactionService";

// 画面再訪時の無駄な再取得を抑える既定TTL（5分）。
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

interface FetchTransactionsOptions {
  force?: boolean;
  cacheTtlMs?: number;
}

const normalizeTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
    date: new Date(transaction.date),
    createdAt: new Date(transaction.createdAt),
  };
};

export const useTransactionStore = defineStore("transaction", () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const hasFetched = ref<boolean>(false);
  const lastFetchedAt = ref<number | null>(null);
  // 同時に複数回呼ばれても1回の通信に集約する。
  let inFlightFetch: Promise<void> | null = null;

  const isCacheValid = (cacheTtlMs: number): boolean => {
    if (!hasFetched.value || lastFetchedAt.value === null) {
      return false;
    }

    return Date.now() - lastFetchedAt.value < cacheTtlMs;
  };

  const fetchTransactions = async (
    options: FetchTransactionsOptions = {},
  ): Promise<void> => {
    const cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;

    // キャッシュ有効期間内はAPIを呼ばない。
    if (!options.force && isCacheValid(cacheTtlMs)) {
      return;
    }

    if (inFlightFetch) {
      return inFlightFetch;
    }

    inFlightFetch = (async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await fetchTransactionsApi();
        transactions.value = response.data.map((transaction) =>
          normalizeTransaction(transaction),
        );
        hasFetched.value = true;
        lastFetchedAt.value = Date.now();
      } catch (err) {
        error.value = "Failed to fetch transactions";
        throw err;
      } finally {
        loading.value = false;
        inFlightFetch = null;
      }
    })();

    return inFlightFetch;
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const createdTransaction = await createTransaction(transaction);
      transactions.value.push(normalizeTransaction(createdTransaction));
      // ローカル反映済みのためキャッシュを最新として扱う。
      hasFetched.value = true;
      lastFetchedAt.value = Date.now();
    } catch (err) {
      error.value = "Failed to add transaction";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTransaction = async (
    id: number,
    updates: Partial<Omit<Transaction, "id" | "createdAt">>,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const updatedTransaction = await updateTransactionApi(id, updates);
      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions.value[index] = normalizeTransaction(updatedTransaction);
        // ローカル反映済みのためキャッシュを最新として扱う。
        hasFetched.value = true;
        lastFetchedAt.value = Date.now();
      }
    } catch (err) {
      error.value = "Failed to update transaction";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTransaction = async (id: number): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      await deleteTransactionApi(id);
      transactions.value = transactions.value.filter((t) => t.id !== id);
      // ローカル反映済みのためキャッシュを最新として扱う。
      hasFetched.value = true;
      lastFetchedAt.value = Date.now();
    } catch (err) {
      error.value = "Failed to delete transaction";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
});
