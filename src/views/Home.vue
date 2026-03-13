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
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">カレンダー</h2>
        <div class="flex items-center gap-3">
          <select
            v-model.number="selectedYear"
            class="px-2 py-1 border border-border rounded-md text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="表示する年を選択"
          >
            <option v-for="year in selectableYears" :key="year" :value="year">
              {{ year }}年
            </option>
          </select>
          <select
            v-model.number="selectedMonthNumber"
            class="px-2 py-1 border border-border rounded-md text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="表示する月を選択"
          >
            <option
              v-for="month in selectableMonths"
              :key="month"
              :value="month"
            >
              {{ month }}月
            </option>
          </select>
        </div>
      </div>
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
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import TransactionList from "@/components/TransactionList.vue";
import { useTransactionStore } from "@/stores/transactionStore";

const transactionStore = useTransactionStore();

const selectedMonth = ref(new Date());
const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
const currentYear = new Date().getFullYear();
const selectableYears = Array.from(
  { length: 21 },
  (_, index) => currentYear - 10 + index,
);
const selectableMonths = Array.from({ length: 12 }, (_, index) => index + 1);

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

const selectedYear = computed({
  get: () => selectedMonth.value.getFullYear(),
  set: (year: number) => {
    selectedMonth.value = startOfMonth(
      new Date(year, selectedMonth.value.getMonth(), 1),
    );
  },
});

const selectedMonthNumber = computed({
  get: () => selectedMonth.value.getMonth() + 1,
  set: (month: number) => {
    selectedMonth.value = startOfMonth(
      new Date(selectedMonth.value.getFullYear(), month - 1, 1),
    );
  },
});

const calendarDates = computed(() => {
  const startDate = startOfWeek(startOfMonth(selectedMonth.value), {
    weekStartsOn: 0,
  });
  const endDate = endOfWeek(endOfMonth(selectedMonth.value), {
    weekStartsOn: 0,
  });
  return eachDayOfInterval({ start: startDate, end: endDate });
});

const isCurrentMonth = (date: Date) => {
  return isSameMonth(date, selectedMonth.value);
};

const getDailyExpense = (date: Date) => {
  return transactionStore.transactions
    .filter((t) => t.type === "expense" && isSameDay(t.date, date))
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
