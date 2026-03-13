<template>
  <div class="category-manager p-6 max-w-4xl mx-auto">
    <div class="max-w-md mx-auto p-6 bg-surface rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">カテゴリ管理</h2>

      <!-- カテゴリ一覧 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">カテゴリ一覧</h3>
        <div class="space-y-2">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center justify-between p-3 bg-secondary-light rounded-md"
          >
            <div class="flex items-center space-x-3">
              <span
                :style="{ backgroundColor: category.color }"
                class="w-4 h-4 rounded-full"
              ></span>
              <span>{{ category.name }}</span>
              <span class="text-sm text-text-secondary"
                >({{ category.type === "income" ? "収入" : "支出" }})</span
              >
            </div>
            <div class="flex space-x-2">
              <button
                @click="editCategory(category)"
                class="text-primary hover:text-primary-light text-sm"
              >
                編集
              </button>
              <button
                @click="deleteCategory(category.id)"
                class="text-error hover:text-accent text-sm"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- カテゴリ追加/編集フォーム -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-text-primary mb-1"
          >
            カテゴリ名
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-primary mb-1">
            タイプ
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="formData.type"
                type="radio"
                value="income"
                class="mr-2"
              />
              収入
            </label>
            <label class="flex items-center">
              <input
                v-model="formData.type"
                type="radio"
                value="expense"
                class="mr-2"
              />
              支出
            </label>
          </div>
        </div>

        <div>
          <label
            for="color"
            class="block text-sm font-medium text-text-primary mb-1"
          >
            色
          </label>
          <input
            id="color"
            v-model="formData.color"
            type="color"
            class="w-full h-10 border border-border rounded-md"
          />
        </div>

        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-primary text-surface py-2 px-4 rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {{ editingCategory ? "更新" : "追加" }}
          </button>
          <button
            v-if="editingCategory"
            type="button"
            @click="cancelEdit"
            class="flex-1 bg-gray text-surface py-2 px-4 rounded-md hover:bg-gray-dark focus:outline-none focus:ring-2 focus:ring-gray"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Category } from "@/types/Category.type";
import { useCategoryStore } from "@/stores/categoryStore";
import { COLOR_TOKENS } from "@/constants/colorTokens";

const categoryStore = useCategoryStore();

const loading = ref(false);
const editingCategory = ref<Category | null>(null);

interface CategoryFormData {
  name: string;
  type: "income" | "expense";
  color: string;
}

const formData = ref<CategoryFormData>({
  name: "",
  type: "expense" as "income" | "expense",
  color: COLOR_TOKENS.primary,
});

const categories = ref(categoryStore.categories);

const editCategory = (category: Category) => {
  editingCategory.value = category;
  formData.value = {
    name: category.name,
    type: category.type,
    color: category.color,
  };
};

const cancelEdit = () => {
  editingCategory.value = null;
  formData.value = {
    name: "",
    type: "expense",
    color: COLOR_TOKENS.primary,
  };
};

const deleteCategory = async (id: number) => {
  if (confirm("このカテゴリを削除しますか？")) {
    try {
      await categoryStore.deleteCategory(id);
      alert("カテゴリを削除しました");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("カテゴリの削除に失敗しました");
    }
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (editingCategory.value) {
      await categoryStore.updateCategory(
        editingCategory.value.id,
        formData.value,
      );
      editingCategory.value = null;
      alert("カテゴリを更新しました");
    } else {
      await categoryStore.addCategory(formData.value);
      alert("カテゴリを追加しました");
    }
    formData.value = {
      name: "",
      type: "expense",
      color: COLOR_TOKENS.primary,
    };
  } catch (error) {
    console.error("Error managing category:", error);
    alert("カテゴリの操作に失敗しました");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<style scoped>
/* 必要に応じてスタイル追加 */
</style>
