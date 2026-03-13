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
          <p class="text-2xl font-bold text-secondary">
            ¥{{ totalExpense.toLocaleString() }}
          </p>
          <p class="text-secondary">支出</p>
        </div>
        <div class="text-center">
          <p
            :class="[
              'text-2xl font-bold',
              balance >= 0 ? 'text-balance-positive' : 'text-balance-negative',
            ]"
          >
            ¥{{ balance.toLocaleString() }}
          </p>
          <p class="text-secondary">収支</p>
        </div>
      </div>
    </div>

    <!-- カレンダー表示 -->
    <div class="bg-surface rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-3 items-center mb-4">
        <button
          type="button"
          class="justify-self-start inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-secondary-light hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="前の月へ"
          @click="moveMonth(-1)"
        >
          <span aria-hidden="true">&lt;</span>
        </button>
        <div class="flex items-center justify-center gap-2">
          <div class="relative">
            <select
              v-model.number="selectedYear"
              class="appearance-none bg-surface border border-border px-3 py-1.5 pr-8 text-sm font-semibold text-text-primary cursor-pointer rounded-full shadow-sm hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-gray"
              aria-label="表示する年を選択"
            >
              <option v-for="year in selectableYears" :key="year" :value="year">
                {{ year }}年
              </option>
            </select>
            <svg
              class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.16l3.71-3.93a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="relative">
            <select
              v-model.number="selectedMonthNumber"
              class="appearance-none bg-surface border border-border px-3 py-1.5 pr-8 text-sm font-semibold text-text-primary cursor-pointer rounded-full shadow-sm hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-gray"
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
            <svg
              class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.16l3.71-3.93a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <button
          type="button"
          class="justify-self-end inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-secondary-light hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="次の月へ"
          @click="moveMonth(1)"
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
      <div
        class="grid grid-cols-7 gap-0 mb-4 border border-border rounded-md overflow-hidden"
      >
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center font-semibold text-text-secondary py-2 bg-secondary-light border-r border-b border-border last:border-r-0"
        >
          {{ day }}
        </div>
      </div>
      <div
        class="grid grid-cols-7 gap-0 border border-border rounded-md overflow-hidden"
      >
        <div
          v-for="date in calendarDates"
          :key="date.toISOString()"
          :class="[
            'p-2 cursor-pointer border-r border-b border-border last:border-r-0 hover:bg-secondary-light flex flex-col items-start justify-between min-h-16',
            isCurrentMonth(date) ? 'text-text-primary' : 'text-disabled',
            isToday(date) ? 'bg-primary-nav-default font-bold' : '',
          ]"
          @click="selectDate(date)"
        >
          <div class="self-start leading-none">{{ date.getDate() }}</div>
          <div class="text-xs w-full mt-1 space-y-0.5">
            <div v-if="getDailyIncome(date) > 0" class="text-balance-positive">
              ¥{{ getDailyIncome(date).toLocaleString() }}
            </div>
            <div v-if="getDailyExpense(date) > 0" class="text-balance-negative">
              ¥{{ getDailyExpense(date).toLocaleString() }}
            </div>
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
  addMonths,
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

const getDailyIncome = (date: Date) => {
  return transactionStore.transactions
    .filter((t) => t.type === "income" && isSameDay(t.date, date))
    .reduce((sum, t) => sum + t.amount, 0);
};

const selectDate = (date: Date) => {
  selectedMonth.value = new Date(date.getFullYear(), date.getMonth(), 1);
};

const moveMonth = (offset: number) => {
  selectedMonth.value = startOfMonth(addMonths(selectedMonth.value, offset));
};

onMounted(() => {
  transactionStore.fetchTransactions();
});
</script>

<style scoped>
/* 必要に応じてスタイル追加 */
</style>
