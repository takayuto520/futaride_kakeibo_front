<template>
  <div class="bg-surface rounded-lg shadow-md p-6 mb-6">
    <h2 class="text-xl font-semibold mb-4">月次収支サマリー</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold text-secondary">
          ¥{{ income.toLocaleString() }}
        </p>
        <p class="text-secondary">収入</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-secondary">
          ¥{{ expense.toLocaleString() }}
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
</template>

<script setup lang="ts">
defineProps<{
  income: number;
  expense: number;
  balance: number;
}>();
</script>
