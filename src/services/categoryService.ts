import type { ApiResponse } from "@/types/User.type";
import type { Category } from "@/types/Category.type";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * カテゴリ一覧を取得する
 * @returns カテゴリ一覧
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data: ApiResponse<Category[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * カテゴリを新規作成する
 * @param category - カテゴリデータ
 * @returns 作成されたカテゴリ
 */
export const createCategory = async (
  category: Omit<Category, "id">,
): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    const data: ApiResponse<Category> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * カテゴリを更新する
 * @param id - カテゴリID
 * @param updates - 更新データ
 * @returns 更新されたカテゴリ
 */
export const updateCategory = async (
  id: number,
  updates: Partial<Omit<Category, "id">>,
): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    const data: ApiResponse<Category> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

/**
 * カテゴリを削除する
 * @param id - カテゴリID
 */
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
