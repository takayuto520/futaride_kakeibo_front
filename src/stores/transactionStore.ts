import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction } from "@/types/Transaction.type";

export const useTransactionStore = defineStore("transaction", () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchTransactions = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      // API呼び出しのシミュレーション
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          userId: 1,
          type: "expense",
          amount: 5000,
          categoryId: 2,
          date: new Date("2024-03-10"),
          memo: "スーパー",
          createdAt: new Date("2024-03-10T10:00:00Z"),
        },
      ];
      transactions.value = mockTransactions;
    } catch (err) {
      error.value = "Failed to fetch transactions";
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
      // API呼び出しのシミュレーション
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now(),
        createdAt: new Date(),
      };
      transactions.value.push(newTransaction);
    } catch (err) {
      error.value = "Failed to add transaction";
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
      // API呼び出しのシミュレーション
      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        const { id: _, ...updateFields } = updates as any;
        transactions.value[index] = {
          ...transactions.value[index],
          ...updateFields,
        };
      }
    } catch (err) {
      error.value = "Failed to update transaction";
    } finally {
      loading.value = false;
    }
  };

  const deleteTransaction = async (id: number): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      // API呼び出しのシミュレーション
      transactions.value = transactions.value.filter((t) => t.id !== id);
    } catch (err) {
      error.value = "Failed to delete transaction";
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
