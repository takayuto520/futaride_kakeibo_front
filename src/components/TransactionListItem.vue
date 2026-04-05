<template>
  <div class="p-4 hover:bg-secondary-light">
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
          <span class="font-medium">{{ categoryName }}</span>
          <span class="text-sm text-text-secondary">
            {{ formatDate(transaction.date) }}
          </span>
        </div>
        <div v-if="transaction.memo" class="text-sm text-text-secondary mt-1">
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
</template>

<script setup lang="ts">
import type { Transaction } from "@/types/Transaction.type";
import { formatDate } from "@/utils/dateUtils";

defineProps<{
  transaction: Transaction;
  categoryName: string;
}>();
</script>
