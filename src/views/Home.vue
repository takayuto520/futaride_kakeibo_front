<template>
  <div class="home p-6 max-w-4xl mx-auto">
    <!-- 月次収支サマリー -->
    <MonthlySummaryCard
      :income="totalIncome"
      :expense="totalExpense"
      :balance="balance"
    />

    <!-- カレンダー表示 -->
    <div class="bg-surface rounded-lg shadow-md p-6 mb-6">
      <MonthNavigator
        :year="selectedYear"
        :month="selectedMonthNumber"
        :selectable-years="selectableYears"
        :selectable-months="selectableMonths"
        @update:year="selectedYear = $event"
        @update:month="selectedMonthNumber = $event"
        @move="moveMonth"
      />
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
import MonthlySummaryCard from "@/components/MonthlySummaryCard.vue";
import MonthNavigator from "@/components/MonthNavigator.vue";
import { useCategoryStore } from "@/stores/categoryStore";
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

const categoryStore = useCategoryStore();

onMounted(() => {
  transactionStore.fetchTransactions();
  categoryStore.fetchCategories();
});
</script>

<style scoped>
/* 必要に応じてスタイル追加 */
</style>
