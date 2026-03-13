<template>
  <div class="transaction-form p-6 max-w-4xl mx-auto">
    <div class="max-w-md mx-auto p-6 bg-surface rounded-lg shadow-md">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- タイプ -->
        <TypeToggle v-model="formData.type" />

        <!-- 金額 -->
        <div>
          <label
            for="amount"
            class="block text-sm font-medium text-text-primary mb-1"
          >
            金額
          </label>
          <input
            id="amount"
            v-model="formData.amount"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            autocomplete="off"
            required
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- カテゴリ -->
        <div>
          <label
            for="category"
            class="block text-sm font-medium text-text-primary mb-1"
          >
            カテゴリ
          </label>
          <select
            id="category"
            v-model="formData.categoryId"
            required
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
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
            class="block text-sm font-medium text-text-primary mb-1"
          >
            メモ
          </label>
          <textarea
            id="memo"
            v-model="formData.memo"
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>

        <!-- 日付 -->
        <div @click="openDatePicker" class="cursor-pointer">
          <label
            for="date"
            class="block text-sm font-medium text-text-primary mb-1"
          >
            日付
          </label>
          <input
            id="date"
            ref="dateInputRef"
            v-model="formData.date"
            type="date"
            required
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          />
        </div>

        <!-- ボタン -->
        <div class="flex space-x-4">
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 bg-gray text-surface py-2 px-4 rounded-md hover:bg-gray-dark focus:outline-none focus:ring-2 focus:ring-gray"
          >
            キャンセル
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-primary text-surface py-2 px-4 rounded-md font-semibold hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {{ loading ? "登録中..." : "登録" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { Transaction } from "@/types/Transaction.type";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCategoryStore } from "@/stores/categoryStore";
import TypeToggle from "@/components/TypeToggle.vue";

interface TransactionFormState {
  type: "income" | "expense";
  categoryId: number;
  memo?: string;
  date: string;
  amount: string;
}

const router = useRouter();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const loading = ref(false);
const categories = computed(() => categoryStore.categories);
const dateInputRef = ref<HTMLInputElement | null>(null);

const getDefaultCategoryId = (): number => {
  return categories.value[0]?.id ?? 0;
};

const formData = ref<TransactionFormState>({
  date: new Date().toLocaleDateString("sv-SE"), // YYYY-MM-DD
  type: "expense" as "income" | "expense",
  amount: "",
  categoryId: getDefaultCategoryId(),
  memo: "",
});

const handleSubmit = async () => {
  const amountText = formData.value.amount.trim();
  const amount = Number(amountText);

  if (!/^\d+$/.test(amountText) || !Number.isFinite(amount) || amount <= 0) {
    alert("金額は1以上を入力してください");
    return;
  }

  loading.value = true;
  try {
    const transaction: Omit<Transaction, "id" | "createdAt"> = {
      userId: 1, // TODO: 現在のユーザーIDを取得
      type: formData.value.type,
      amount,
      categoryId: formData.value.categoryId,
      date: new Date(formData.value.date),
      memo: formData.value.memo,
    };

    await transactionStore.addTransaction(transaction);

    // フォームリセット
    formData.value = {
      date: new Date().toLocaleDateString("sv-SE"),
      type: "expense",
      amount: "",
      categoryId: getDefaultCategoryId(),
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

const openDatePicker = () => {
  const dateInput = dateInputRef.value;
  if (!dateInput) return;

  dateInput.focus();
  if (typeof dateInput.showPicker === "function") {
    try {
      dateInput.showPicker();
      return;
    } catch (error) {
      // Fallback for browsers that restrict showPicker calls.
    }
  }

  dateInput.click();
};

onMounted(async () => {
  await categoryStore.fetchCategories();
  const firstCategory =
    categories.value.length > 0 ? categories.value[0] : null;
  if (firstCategory && formData.value.categoryId === 0) {
    formData.value.categoryId = firstCategory.id;
  }
});
</script>

<style scoped>
/* 必要に応じてスタイル追加 */
</style>
