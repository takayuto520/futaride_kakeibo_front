<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="
        emit(
          'update:modelValue',
          Number(($event.target as HTMLSelectElement).value),
        )
      "
      class="appearance-none bg-surface border border-border px-3 py-1.5 pr-8 text-sm font-semibold text-text-primary cursor-pointer rounded-full shadow-sm hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-gray"
      :aria-label="ariaLabel"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
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
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number;
  options: { value: number; label: string }[];
  ariaLabel?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();
</script>
