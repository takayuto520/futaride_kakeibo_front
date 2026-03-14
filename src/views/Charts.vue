<template>
  <div class="charts p-6 max-w-4xl mx-auto">
    <!-- 支出カテゴリ別円グラフ -->
    <div class="bg-surface rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">支出カテゴリ別</h2>
      <div class="flex justify-center">
        <div class="w-64 h-64 relative">
          <svg
            viewBox="0 0 100 100"
            class="w-full h-full text-border overflow-visible"
          >
            <g v-for="(slice, index) in pieSlices" :key="`path-${index}`">
              <path
                :d="slice.path"
                :fill="slice.color"
                stroke="currentColor"
                stroke-width="0.5"
              />
            </g>
            <g v-for="(slice, index) in pieSlices" :key="`label-${index}`">
              <text
                v-if="slice.showLabel"
                :x="slice.labelX"
                :y="slice.labelY"
                text-anchor="middle"
                dominant-baseline="middle"
                class="text-[8px]"
                fill="#FFFFFF"
              >
                {{ slice.label }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- カテゴリ別合計金額リスト -->
    <div class="bg-surface rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">カテゴリ別合計</h2>
      <div class="space-y-2">
        <div
          v-for="category in categoryTotals"
          :key="category.id"
          class="flex justify-between items-center p-3 border border-border rounded"
        >
          <div class="flex items-center">
            <div
              class="w-4 h-4 rounded mr-3"
              :style="{ backgroundColor: category.color }"
            ></div>
            <span>{{ category.name }}</span>
          </div>
          <span class="font-semibold"
            >¥{{ category.total.toLocaleString() }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCategoryStore } from "@/stores/categoryStore";

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const categoryTotals = computed(() => {
  const totals = categoryStore.categories
    .map((category) => {
      const total = transactionStore.transactions
        .filter((t) => t.categoryId === category.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...category,
        total,
      };
    })
    .filter((cat) => cat.total > 0);

  return totals;
});

const pieSlices = computed(() => {
  const MIN_LABEL_ANGLE = 24;
  const totalExpense = categoryTotals.value.reduce(
    (sum, cat) => sum + cat.total,
    0,
  );
  if (totalExpense === 0) return [];

  // 12時方向から開始するため -90 度を初期角度にする
  let cumulativeAngle = -90;

  return categoryTotals.value.map((category) => {
    const angle = (category.total / totalExpense) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const labelAngle = startAngle + angle / 2;
    const labelAngleRad = (labelAngle * Math.PI) / 180;
    const labelX = 50 + 25 * Math.cos(labelAngleRad);
    const labelY = 50 + 25 * Math.sin(labelAngleRad);

    cumulativeAngle = endAngle;

    return {
      path,
      color: category.color,
      label: category.name,
      showLabel: angle >= MIN_LABEL_ANGLE,
      labelX,
      labelY,
    };
  });
});

onMounted(() => {
  transactionStore.fetchTransactions();
  categoryStore.fetchCategories();
});
</script>

<style scoped>
svg {
  overflow: visible;
}
</style>
