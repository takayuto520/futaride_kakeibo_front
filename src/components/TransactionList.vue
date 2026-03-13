<template>
  <div class="bg-surface rounded-lg shadow-md">
    <div class="p-4 border-b border-border">
      <h3 class="text-lg font-semibold">取引履歴</h3>
    </div>
    <div class="max-h-96 overflow-y-auto">
      <div
        v-if="transactions.length === 0"
        class="p-4 text-center text-text-secondary"
      >
        取引がありません
      </div>
      <div v-else class="divide-y divide-border">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="p-4 hover:bg-secondary-light"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span
                  :class="[
                    'inline-block w-3 h-3 rounded-full',
                    transaction.type === 'income'
                      ? 'bg-balance-positive'
                      : 'bg-balance-negative',
                  ]"
                ></span>
                <span class="font-medium">
                  {{ getCategoryName(transaction.categoryId) }}
                </span>
                <span class="text-sm text-text-secondary">
                  {{ formatDate(transaction.date) }}
                </span>
              </div>
              <div
                v-if="transaction.memo"
                class="text-sm text-text-secondary mt-1"
              >
                {{ transaction.memo }}
              </div>
            </div>
            <div class="text-right">
              <div
                :class="[
                  'font-semibold',
                  transaction.type === 'income'
                    ? 'text-balance-positive'
                    : 'text-balance-negative',
                ]"
              >
                {{ transaction.type === "income" ? "+" : "-" }}¥{{
                  transaction.amount.toLocaleString()
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { formatDate } from "@/utils/dateUtils";

interface Props {
  selectedMonth?: Date;
}

const props = withDefaults(defineProps<Props>(), {
  selectedMonth: () => new Date(),
});

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const transactions = computed(() => {
  if (!props.selectedMonth) return transactionStore.transactions;

  // 選択された月の取引のみフィルタリング
  return transactionStore.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === props.selectedMonth.getFullYear() &&
      transactionDate.getMonth() === props.selectedMonth.getMonth()
    );
  });
});

const getCategoryName = (categoryId: number): string => {
  const category = categoryStore.categories.find((c) => c.id === categoryId);
  return category ? category.name : "不明";
};

onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<style scoped>
/* 必要に応じてスタイル追加 */
</style>
