import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction } from "@/types/Transaction.type";
import {
  createTransaction,
  deleteTransaction as deleteTransactionApi,
  fetchTransactions as fetchTransactionsApi,
  updateTransaction as updateTransactionApi,
} from "@/services/transactionService";

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

  const fetchTransactions = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetchTransactionsApi();
      transactions.value = response.data.map((transaction) =>
        normalizeTransaction(transaction),
      );
    } catch (err) {
      error.value = "Failed to fetch transactions";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "createdAt">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const createdTransaction = await createTransaction(transaction);
      transactions.value.push(normalizeTransaction(createdTransaction));
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
