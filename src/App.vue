<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <div id="app" class="bg-background text-text-primary">
    <header class="bg-primary-light text-surface p-4">
      <nav class="flex justify-center space-x-4">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-nav-default hover:bg-primary-nav-hover hover:text-surface aria-disabled:text-primary-nav-inactive aria-disabled:pointer-events-none transition-colors duration-200"
          exact-active-class="bg-primary-nav-active text-primary-nav-active-text font-semibold shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="w-5 h-5"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" />
          </svg>
          <span>ホーム</span>
        </RouterLink>
        <RouterLink
          to="/input"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-nav-default hover:bg-primary-nav-hover hover:text-surface aria-disabled:text-primary-nav-inactive aria-disabled:pointer-events-none transition-colors duration-200"
          exact-active-class="bg-primary-nav-active text-primary-nav-active-text font-semibold shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M3 21h6l11-11a2.2 2.2 0 0 0-6-6L3 15v6z" />
            <path d="M14 5l5 5" />
          </svg>
          <span>入力</span>
        </RouterLink>
        <RouterLink
          to="/charts"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-nav-default hover:bg-primary-nav-hover hover:text-surface aria-disabled:text-primary-nav-inactive aria-disabled:pointer-events-none transition-colors duration-200"
          exact-active-class="bg-primary-nav-active text-primary-nav-active-text font-semibold shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="w-5 h-5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v9h9" />
          </svg>
          <span>グラフ</span>
        </RouterLink>
        <RouterLink
          to="/categories"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md text-primary-nav-default hover:bg-primary-nav-hover hover:text-surface aria-disabled:text-primary-nav-inactive aria-disabled:pointer-events-none transition-colors duration-200"
          exact-active-class="bg-primary-nav-active text-primary-nav-active-text font-semibold shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
            <path
              d="M19 12a7 7 0 0 0-.08-1l2.02-1.57-1.9-3.3-2.45 1a7.2 7.2 0 0 0-1.73-1L14.5 3h-5L9.14 6.13a7.2 7.2 0 0 0-1.73 1l-2.45-1-1.9 3.3L5.08 11a7 7 0 0 0 0 2l-2.02 1.57 1.9 3.3 2.45-1a7.2 7.2 0 0 0 1.73 1L9.5 21h5l.36-3.13a7.2 7.2 0 0 0 1.73-1l2.45 1 1.9-3.3L18.92 13c.05-.33.08-.66.08-1z"
            />
          </svg>
          <span>カテゴリ</span>
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
</style>
