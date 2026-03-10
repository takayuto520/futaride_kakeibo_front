import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Charts from "@/views/Charts.vue";
import TransactionForm from "@/views/TransactionForm.vue";
import CategoryManager from "@/views/CategoryManager.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/input",
    name: "TransactionForm",
    component: TransactionForm,
  },
  {
    path: "/charts",
    name: "Charts",
    component: Charts,
  },
  {
    path: "/categories",
    name: "CategoryManager",
    component: CategoryManager,
  },
  // 他のルートをここに追加
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
