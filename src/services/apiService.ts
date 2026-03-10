import type { User, ApiResponse } from "@/types/User.type";
import type {
  Transaction,
  TransactionsResponse,
} from "@/types/Transaction.type";
import type { Category } from "@/types/Category.type";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ユーザー一覧を取得する
 * @returns ユーザー一覧
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data: ApiResponse<User[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * ユーザーを取得する
 * @param id - ユーザーID
 * @returns ユーザー情報
 */
export const fetchUser = async (id: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data: ApiResponse<User> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * 取引一覧を取得する
 * @returns 取引一覧
 */
export const fetchTransactions = async (): Promise<TransactionsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data: TransactionsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

/**
 * 取引を新規作成する
 * @param transaction - 取引データ
 * @returns 作成された取引
 */
export const createTransaction = async (
  transaction: Omit<Transaction, "id" | "createdAt">,
): Promise<Transaction> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Failed to create transaction");
    }
    const data: ApiResponse<Transaction> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

/**
 * 取引を更新する
 * @param id - 取引ID
 * @param updates - 更新データ
 * @returns 更新された取引
 */
export const updateTransaction = async (
  id: number,
  updates: Partial<Omit<Transaction, "id" | "createdAt">>,
): Promise<Transaction> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }
    const data: ApiResponse<Transaction> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

/**
 * 取引を削除する
 * @param id - 取引ID
 */
export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

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
