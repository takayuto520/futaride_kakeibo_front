<template>
  <div class="home p-6 max-w-4xl mx-auto">
    <!-- 月次収支サマリー -->
    <div class="bg-surface rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">月次収支サマリー</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-secondary">
            ¥{{ totalIncome.toLocaleString() }}
          </p>
          <p class="text-secondary">収入</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-accent">
            ¥{{ totalExpense.toLocaleString() }}
          </p>
          <p class="text-secondary">支出</p>
        </div>
        <div class="text-center">
          <p
            class="text-2xl font-bold {{ balance >= 0 ? 'text-balance-positive' : 'text-balance-negative' }}"
          >
            ¥{{ balance.toLocaleString() }}
          </p>
          <p class="text-secondary">収支</p>
        </div>
      </div>
    </div>

    <!-- カレンダー表示 -->
    <div class="bg-surface rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">カレンダー</h2>
      <div class="grid grid-cols-7 gap-2 mb-4">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center font-semibold text-text-secondary"
        >
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="date in calendarDates"
          :key="date.toISOString()"
          :class="[
            'text-center p-2 rounded cursor-pointer hover:bg-secondary-light',
            isCurrentMonth(date) ? 'text-text-primary' : 'text-disabled',
            isToday(date) ? 'bg-primary-nav-default font-bold' : '',
          ]"
          @click="selectDate(date)"
        >
          <div>{{ date.getDate() }}</div>
          <div class="text-xs text-balance-negative">
            ¥{{ getDailyExpense(date).toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- 取引履歴 -->
    <TransactionList :selected-month="selectedMonth" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import TransactionList from "@/components/TransactionList.vue";
import { useTransactionStore } from "@/stores/transactionStore";

const transactionStore = useTransactionStore();

const selectedMonth = ref(new Date());
const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

const totalIncome = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpense = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
});

const balance = computed(() => totalIncome.value - totalExpense.value);

const calendarDates = computed(() => {
  const year = selectedMonth.value.getFullYear();
  const month = selectedMonth.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const dates = [];
  const current = new Date(startDate);
  while (current <= lastDay || dates.length % 7 !== 0) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
});

const isCurrentMonth = (date: Date) => {
  return date.getMonth() === selectedMonth.value.getMonth();
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const getDailyExpense = (date: Date) => {
  return transactionStore.transactions
    .filter(
      (t) =>
        t.type === "expense" && t.date.toDateString() === date.toDateString(),
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

const selectDate = (date: Date) => {
  selectedMonth.value = new Date(date.getFullYear(), date.getMonth(), 1);
};

onMounted(() => {
  transactionStore.fetchTransactions();
});
</script>

<style scoped>
/* 必要に応じてスタイル追加 */
</style>
