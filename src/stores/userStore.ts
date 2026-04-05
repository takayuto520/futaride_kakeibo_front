import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "@/types/User.type";

export const useUserStore = defineStore("user", () => {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref<boolean>(false);

  const login = async (email: string, password: string): Promise<void> => {
    // API呼び出しのシミュレーション
    if (email === "user@example.com" && password === "password") {
      const user: User = {
        id: 1,
        name: "John Doe",
        email: "user@example.com",
        createdAt: new Date(),
      };
      currentUser.value = user;
      isAuthenticated.value = true;
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = (): void => {
    currentUser.value = null;
    isAuthenticated.value = false;
  };

  const fetchUser = async (id: number): Promise<void> => {
    // API呼び出しのシミュレーション
    const user: User = {
      id,
      name: "John Doe",
      email: "user@example.com",
      createdAt: new Date(),
    };
    currentUser.value = user;
  };

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  };
});
