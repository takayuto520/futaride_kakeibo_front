<template>
  <div class="grid grid-cols-3 items-center mb-4">
    <button
      type="button"
      class="justify-self-start inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-secondary-light hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="前の月へ"
      @click="emit('move', -1)"
    >
      <span aria-hidden="true">&lt;</span>
    </button>
    <div class="flex items-center justify-center gap-2">
      <StyledSelect
        :model-value="year"
        :options="yearOptions"
        aria-label="表示する年を選択"
        @update:model-value="emit('update:year', $event)"
      />
      <StyledSelect
        :model-value="month"
        :options="monthOptions"
        aria-label="表示する月を選択"
        @update:model-value="emit('update:month', $event)"
      />
    </div>
    <button
      type="button"
      class="justify-self-end inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-secondary-light hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="次の月へ"
      @click="emit('move', 1)"
    >
      <span aria-hidden="true">&gt;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import StyledSelect from "./StyledSelect.vue";

const props = defineProps<{
  year: number;
  month: number;
  selectableYears: number[];
  selectableMonths: number[];
}>();

const emit = defineEmits<{
  "update:year": [value: number];
  "update:month": [value: number];
  move: [offset: number];
}>();

const yearOptions = computed(() =>
  props.selectableYears.map((y) => ({ value: y, label: `${y}年` })),
);

const monthOptions = computed(() =>
  props.selectableMonths.map((m) => ({ value: m, label: `${m}月` })),
);
</script>
