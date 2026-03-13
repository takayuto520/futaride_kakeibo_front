<template>
  <div
    class="grid grid-cols-2 gap-1 p-1 rounded-lg border border-border bg-secondary-light"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <button
      type="button"
      role="radio"
      :aria-checked="modelValue === 'expense'"
      @click="emit('update:modelValue', 'expense')"
      :class="[
        'py-2 rounded-md text-sm font-semibold transition-colors',
        modelValue === 'expense'
          ? 'bg-surface text-primary-active shadow-sm'
          : 'text-text-secondary hover:bg-surface/70',
      ]"
    >
      支出
    </button>
    <button
      type="button"
      role="radio"
      :aria-checked="modelValue === 'income'"
      @click="emit('update:modelValue', 'income')"
      :class="[
        'py-2 rounded-md text-sm font-semibold transition-colors',
        modelValue === 'income'
          ? 'bg-surface text-primary-active shadow-sm'
          : 'text-text-secondary hover:bg-surface/70',
      ]"
    >
      収入
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: "income" | "expense";
    ariaLabel?: string;
  }>(),
  { ariaLabel: "取引タイプ" },
);

const emit = defineEmits<{
  "update:modelValue": [value: "income" | "expense"];
}>();
</script>
