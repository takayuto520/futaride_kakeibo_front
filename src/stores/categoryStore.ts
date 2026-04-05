import { defineStore } from "pinia";
import { ref } from "vue";
import type { Category } from "@/types/Category.type";
import * as categoryService from "@/services/categoryService";

// カテゴリは更新頻度が比較的低いためTTLは長めに設定。
const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000;

interface FetchCategoriesOptions {
  force?: boolean;
  cacheTtlMs?: number;
}

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);
  const hasFetched = ref<boolean>(false);
  const lastFetchedAt = ref<number | null>(null);
  // 同時アクセス時の重複リクエストを防止する。
  let inFlightFetch: Promise<void> | null = null;

  const isCacheValid = (cacheTtlMs: number): boolean => {
    if (!hasFetched.value || lastFetchedAt.value === null) {
      return false;
    }

    return Date.now() - lastFetchedAt.value < cacheTtlMs;
  };

  const fetchCategories = async (
    options: FetchCategoriesOptions = {},
  ): Promise<void> => {
    const cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;

    // キャッシュ有効期間内はAPIを呼ばない。
    if (!options.force && isCacheValid(cacheTtlMs)) {
      return;
    }

    if (inFlightFetch) {
      return inFlightFetch;
    }

    inFlightFetch = (async () => {
      categories.value = await categoryService.fetchCategories();
      hasFetched.value = true;
      lastFetchedAt.value = Date.now();
    })();

    try {
      await inFlightFetch;
    } finally {
      inFlightFetch = null;
    }
  };

  const addCategory = async (category: Omit<Category, "id">): Promise<void> => {
    const createdCategory = await categoryService.createCategory(category);
    categories.value.push(createdCategory);
    // ローカル反映済みのためキャッシュを最新として扱う。
    hasFetched.value = true;
    lastFetchedAt.value = Date.now();
  };

  const updateCategory = async (
    id: number,
    updates: Partial<Omit<Category, "id">>,
  ): Promise<void> => {
    const index = categories.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      const { id: _, ...updateFields } = updates as any;
      categories.value[index] = { ...categories.value[index], ...updateFields };
      // ローカル反映済みのためキャッシュを最新として扱う。
      hasFetched.value = true;
      lastFetchedAt.value = Date.now();
    }
  };

  const deleteCategory = async (id: number): Promise<void> => {
    categories.value = categories.value.filter((c) => c.id !== id);
    // ローカル反映済みのためキャッシュを最新として扱う。
    hasFetched.value = true;
    lastFetchedAt.value = Date.now();
  };

  return {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
