import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Charts from "@/views/Charts.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/charts",
    name: "Charts",
    component: Charts,
  },
  // 他のルートをここに追加
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
