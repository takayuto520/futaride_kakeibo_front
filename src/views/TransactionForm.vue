<template>
  <div class="transaction-form p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">記録入力</h1>
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">取引登録</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 日付 -->
        <div>
          <label
            for="date"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            日付
          </label>
          <input
            id="date"
            v-model="formData.date"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- タイプ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
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

        <!-- 金額 -->
        <div>
          <label
            for="amount"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            金額
          </label>
          <input
            id="amount"
            v-model.number="formData.amount"
            type="number"
            min="1"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- カテゴリ -->
        <div>
          <label
            for="category"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            カテゴリ
          </label>
          <select
            id="category"
            v-model="formData.categoryId"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- メモ -->
        <div>
          <label
            for="memo"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            メモ
          </label>
          <textarea
            id="memo"
            v-model="formData.memo"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- ボタン -->
        <div class="flex space-x-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? "登録中..." : "登録" }}
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
import { useRouter } from "vue-router";
import type { Transaction } from "@/types/Transaction.type";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCategoryStore } from "@/stores/categoryStore";

interface FormTransaction extends Omit<
  Transaction,
  "id" | "userId" | "createdAt" | "date"
> {
  date: string;
}

const router = useRouter();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const loading = ref(false);
const categories = ref(categoryStore.categories);

const formData = ref<FormTransaction>({
  date: new Date().toLocaleDateString("sv-SE"), // YYYY-MM-DD
  type: "expense" as "income" | "expense",
  amount: 0,
  categoryId: 0,
  memo: "",
});

const handleSubmit = async () => {
  if (formData.value.amount <= 0) {
    alert("金額は1以上を入力してください");
    return;
  }

  loading.value = true;
  try {
    const transaction: Omit<Transaction, "id" | "createdAt"> = {
      userId: 1, // TODO: 現在のユーザーIDを取得
      type: formData.value.type,
      amount: formData.value.amount,
      categoryId: formData.value.categoryId,
      date: new Date(formData.value.date),
      memo: formData.value.memo,
    };

    await transactionStore.addTransaction(transaction);

    // フォームリセット
    formData.value = {
      date: new Date().toLocaleDateString("sv-SE"),
      type: "expense",
      amount: 0,
      categoryId: 0,
      memo: "",
    };

    alert("取引が登録されました");
    router.push("/");
  } catch (error) {
    console.error("取引登録エラー:", error);
    alert("取引の登録に失敗しました");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push("/");
};

onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<style scoped>
/* 必要に応じてスタイル追加 */
</style>
