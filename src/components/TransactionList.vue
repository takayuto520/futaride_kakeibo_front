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
        <TransactionListItem
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
          :category-name="getCategoryName(transaction.categoryId)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCategoryStore } from "@/stores/categoryStore";
import TransactionListItem from "@/components/TransactionListItem.vue";

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
