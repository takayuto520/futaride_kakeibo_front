<template>
  <span
    :style="{ backgroundColor: color }"
    class="inline-block w-4 h-4 rounded-full flex-shrink-0"
  ></span>
</template>

<script setup lang="ts">
defineProps<{
  color: string;
}>();
</script>
