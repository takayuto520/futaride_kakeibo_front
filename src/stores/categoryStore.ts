import { defineStore } from "pinia";
import { ref } from "vue";
import type { Category } from "@/types/Category.type";
import * as categoryService from "@/services/categoryService";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);

  const fetchCategories = async (): Promise<void> => {
    categories.value = await categoryService.fetchCategories();
  };

  const addCategory = async (category: Omit<Category, "id">): Promise<void> => {
    const createdCategory = await categoryService.createCategory(category);
    categories.value.push(createdCategory);
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
