import { defineStore } from "pinia";
import { ref } from "vue";
import type { Category } from "@/types/Category.type";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);

  const fetchCategories = async (): Promise<void> => {
    // API呼び出しのシミュレーション
    const mockCategories: Category[] = [
      { id: 1, name: "食費", type: "expense", color: "#EF4444" },
      { id: 2, name: "日用品", type: "expense", color: "#10B981" },
      { id: 3, name: "交通費", type: "expense", color: "#3B82F6" },
      { id: 4, name: "住居費", type: "expense", color: "#8B5CF6" },
      { id: 5, name: "公共料金", type: "expense", color: "#F59E0B" },
      { id: 6, name: "交際費", type: "expense", color: "#EC4899" },
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

  const updateCategory = async (
    id: number,
    updates: Partial<Omit<Category, "id">>,
  ): Promise<void> => {
    const index = categories.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      const { id: _, ...updateFields } = updates as any;
      categories.value[index] = { ...categories.value[index], ...updateFields };
    }
  };

  const deleteCategory = async (id: number): Promise<void> => {
    categories.value = categories.value.filter((c) => c.id !== id);
  };

  return {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
