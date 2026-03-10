<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <div id="app">
    <header class="bg-primary p-4">
      <h1 class="text-2xl font-bold mb-4">ふたりで家計簿</h1>
      <nav class="flex space-x-4">
        <RouterLink
          to="/"
          class="px-4 py-2 rounded-md hover:bg-primary-light transition-colors"
          active-class="bg-primary"
        >
          ホーム
        </RouterLink>
        <RouterLink
          to="/input"
          class="px-4 py-2 rounded-md hover:bg-primary-light transition-colors"
          active-class="bg-primary"
        >
          入力
        </RouterLink>
        <RouterLink
          to="/charts"
          class="px-4 py-2 rounded-md hover:bg-primary-light transition-colors"
          active-class="bg-primary"
        >
          グラフ
        </RouterLink>
        <RouterLink
          to="/categories"
          class="px-4 py-2 rounded-md hover:bg-primary-light transition-colors"
          active-class="bg-primary"
        >
          カテゴリ
        </RouterLink>
      </nav>
    </header>
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
