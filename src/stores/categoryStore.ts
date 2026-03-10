import { defineStore } from "pinia";
import { ref } from "vue";
import type { Category } from "@/types/Category.type";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);

  const fetchCategories = async (): Promise<void> => {
    // API呼び出しのシミュレーション
    const mockCategories: Category[] = [
      { id: 1, name: "給与", type: "income", color: "#10B981" },
      { id: 2, name: "食費", type: "expense", color: "#EF4444" },
      { id: 3, name: "交通費", type: "expense", color: "#3B82F6" },
    ];
    categories.value = mockCategories;
  };

  const addCategory = async (category: Omit<Category, "id">): Promise<void> => {
    // API呼び出しのシミュレーション
    const newCategory: Category = {
      ...category,
      id: Date.now(),
    };
    categories.value.push(newCategory);
  };

  return {
    categories,
    fetchCategories,
    addCategory,
  };
});
