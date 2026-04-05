<template>
  <div class="category-manager p-6 max-w-4xl mx-auto">
    <div class="max-w-md mx-auto p-6 bg-surface rounded-lg shadow-md">
      <!-- タイプトグル -->
      <TypeToggle
        :model-value="selectedType"
        aria-label="カテゴリタイプ"
        class="mb-6"
        @update:model-value="switchType"
      />

      <!-- カテゴリ一覧 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-4">カテゴリ一覧</h3>
        <div class="space-y-2">
          <p
            v-if="filteredCategories.length === 0"
            class="text-text-secondary text-sm"
          >
            カテゴリがありません
          </p>
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="flex items-center justify-between p-3 bg-secondary-light rounded-md"
          >
            <div class="flex items-center space-x-3">
              <CategoryColorDot :color="category.color" />
              <span>{{ category.name }}</span>
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
          <label
            for="color"
            class="block text-sm font-medium text-text-primary mb-1"
          >
            色
          </label>

          <div
            class="grid grid-cols-2 gap-1 p-1 rounded-lg border border-border bg-secondary-light mb-3"
          >
            <button
              type="button"
              @click="setColorMode('preset')"
              :class="[
                'py-2 rounded-md text-sm font-semibold transition-colors',
                selectedColorMode === 'preset'
                  ? 'bg-surface text-primary-active shadow-sm'
                  : 'text-text-secondary hover:bg-surface/70',
              ]"
            >
              プリセット
            </button>
            <button
              type="button"
              @click="setColorMode('custom')"
              :class="[
                'py-2 rounded-md text-sm font-semibold transition-colors',
                selectedColorMode === 'custom'
                  ? 'bg-surface text-primary-active shadow-sm'
                  : 'text-text-secondary hover:bg-surface/70',
              ]"
            >
              カスタム
            </button>
          </div>

          <div
            v-if="selectedColorMode === 'preset'"
            class="grid grid-cols-6 gap-2"
          >
            <button
              v-for="preset in presetColors"
              :key="preset.label"
              type="button"
              :title="preset.label"
              :aria-label="`${preset.label}を選択`"
              @click="selectPresetColor(preset.value)"
              :class="[
                'relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-all',
                formData.color.toLowerCase() === preset.value.toLowerCase()
                  ? 'border-primary ring-2 ring-primary scale-105'
                  : 'hover:border-border hover:ring-1 hover:ring-border',
              ]"
            >
              <span
                class="inline-block h-7 w-7 rounded-full border border-border"
                :style="{ backgroundColor: preset.value }"
              ></span>
              <span
                v-if="isPresetColorUsed(preset.value)"
                class="absolute -right-0.5 -bottom-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-surface bg-text-primary text-[10px] font-bold leading-none text-surface"
              >
                ✓
              </span>
            </button>
          </div>

          <div v-else class="space-y-2">
            <input
              id="color"
              v-model="formData.color"
              type="color"
              class="w-full h-10 border border-border rounded-md"
            />
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            v-if="editingCategory"
            type="button"
            @click="cancelEdit"
            class="flex-1 bg-gray text-surface py-2 px-4 rounded-md hover:bg-gray-dark focus:outline-none focus:ring-2 focus:ring-gray"
          >
            キャンセル
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-primary text-surface py-2 px-4 rounded-md font-semibold hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {{ editingCategory ? "更新" : "追加" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Category } from "@/types/Category.type";
import { useCategoryStore } from "@/stores/categoryStore";
import TypeToggle from "@/components/TypeToggle.vue";
import CategoryColorDot from "@/components/CategoryColorDot.vue";

const categoryStore = useCategoryStore();

const loading = ref(false);
const editingCategory = ref<Category | null>(null);
const selectedType = ref<"income" | "expense">("expense");
const selectedColorMode = ref<"preset" | "custom">("preset");

const presetColors = [
  { label: "赤", value: "#E36A6A" },
  { label: "ピンク", value: "#D96AA7" },
  { label: "オレンジ", value: "#E79A4E" },
  { label: "黄色", value: "#D9BC4B" },
  { label: "緑", value: "#4FAE7A" },
  { label: "黄緑", value: "#9ABB4A" },
  { label: "青", value: "#4A8FD9" },
  { label: "水色", value: "#4CB8C8" },
  { label: "紫", value: "#8B76D9" },
  { label: "ブラウン", value: "#9A735C" },
  { label: "ベージュ", value: "#C6A77B" },
  { label: "グレー", value: "#8A949F" },
] as const;

const defaultPresetColor = presetColors[4].value;

interface CategoryFormData {
  name: string;
  type: "income" | "expense";
  color: string;
}

const formData = ref<CategoryFormData>({
  name: "",
  type: "expense",
  color: defaultPresetColor,
});

const isPresetColor = (color: string): boolean => {
  const normalized = color.toLowerCase();
  return presetColors.some(
    (preset) => preset.value.toLowerCase() === normalized,
  );
};

const selectPresetColor = (color: string) => {
  formData.value.color = color;
};

const setColorMode = (mode: "preset" | "custom") => {
  selectedColorMode.value = mode;
  if (mode === "preset" && !isPresetColor(formData.value.color)) {
    formData.value.color = defaultPresetColor;
  }
};

const filteredCategories = computed(() =>
  categoryStore.categories.filter((c) => c.type === selectedType.value),
);

const usedPresetColorSet = computed(() => {
  return new Set(
    filteredCategories.value
      .map((category) => category.color.toLowerCase())
      .filter((color) => isPresetColor(color)),
  );
});

const isPresetColorUsed = (color: string): boolean => {
  return usedPresetColorSet.value.has(color.toLowerCase());
};

const switchType = (type: "income" | "expense") => {
  selectedType.value = type;
  // タイプ切替時は編集をキャンセルしてフォームをリセット
  editingCategory.value = null;
  selectedColorMode.value = "preset";
  formData.value = {
    name: "",
    type,
    color: defaultPresetColor,
  };
};

const editCategory = (category: Category) => {
  editingCategory.value = category;
  formData.value = {
    name: category.name,
    type: category.type,
    color: category.color,
  };
  selectedColorMode.value = isPresetColor(category.color) ? "preset" : "custom";
};

const cancelEdit = () => {
  editingCategory.value = null;
  selectedColorMode.value = "preset";
  formData.value = {
    name: "",
    type: selectedType.value,
    color: defaultPresetColor,
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
      await categoryStore.addCategory({
        ...formData.value,
        type: selectedType.value,
      });
      alert("カテゴリを追加しました");
    }
    formData.value = {
      name: "",
      type: selectedType.value,
      color: defaultPresetColor,
    };
    selectedColorMode.value = "preset";
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
