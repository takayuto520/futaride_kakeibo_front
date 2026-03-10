# 設計書

## 1. プロジェクト概要

### 1.1 プロジェクト名

ふたりで家計簿 (Futaride Kakeibo)

### 1.2 目的

夫婦やカップル向けの家計簿管理アプリケーション。収入・支出の記録と分析を通じて、資産管理を支援する。

### 1.3 技術スタック

- **フロントエンド**: Vue 3 (Composition API), Vite
- **状態管理**: Pinia
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript
- **テスト**: Vitest + @vue/test-utils
- **ビルドツール**: Vite

### 1.4 システム構成

```
src/
├ components/     # 再利用可能なコンポーネント
├ views/          # ページコンポーネント
├ stores/         # Piniaストア（状態管理）
├ services/       # API通信などのサービス層
├ router/         # Vue Router設定
├ assets/         # 静的アセット
├ types/          # TypeScript型定義
├ utils/          # ユーティリティ関数
├ style.css       # グローバルスタイル
├ App.vue         # ルートコンポーネント
└ main.ts         # エントリーポイント
```

## 2. 機能要件

### 2.1 コア機能

- **収入・支出記録**: 日付、金額、カテゴリ、メモの入力
- **カテゴリ管理**: 収入・支出のカテゴリ設定
- **集計・レポート**: 月次・年次集計、グラフ表示
- **ユーザー管理**: 複数ユーザー対応（夫婦間共有）

### 2.2 非機能要件

- **パフォーマンス**: ページロード時間 2秒以内
- **セキュリティ**: ユーザー認証、データ暗号化
- **レスポンシブ**: モバイル・デスクトップ対応
- **アクセシビリティ**: WCAG 2.1 AA準拠

## 3. 画面設計

### 3.1 画面一覧

| 画面名       | 説明                                 | コンポーネント      |
| ------------ | ------------------------------------ | ------------------- |
| ホーム       | 概要ダッシュボード                   | Home.vue            |
| 記録入力     | 収入・支出の新規登録                 | TransactionForm.vue |
| 記録一覧     | 取引履歴表示                         | TransactionList.vue |
| カテゴリ管理 | カテゴリの追加・編集                 | CategoryManager.vue |
| グラフ       | 支出カテゴリ別円グラフと合計金額一覧 | Charts.vue          |

### 3.2 ホーム画面 (Home.vue)

- 月次収支サマリー
- カレンダー表示（日付ごとの支出額表示）
- カレンダー表示している月の取引履歴（全件表示、スクロール可能）

### 3.3 記録入力画面 (TransactionForm.vue)

- フォーム項目:
  - 日付 (DatePicker)
  - タイプ (収入/支出, RadioButton)
  - 金額 (NumberInput)
  - カテゴリ (Select)
  - メモ (TextArea)
- バリデーション: 金額必須、金額 > 0

### 3.4 グラフ画面 (Charts.vue)

- 支出カテゴリ別円グラフ
- カテゴリごとの合計金額一覧

## 4. データモデル

### 4.1 User (ユーザー)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
```

### 4.2 Category (カテゴリ)

```typescript
interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
}
```

### 4.3 Transaction (取引)

```typescript
interface Transaction {
  id: number;
  userId: number;
  type: "income" | "expense";
  amount: number;
  categoryId: number;
  date: Date;
  memo?: string;
  createdAt: Date;
}
```

## 5. API設計

### 5.1 エンドポイント一覧

| メソッド | エンドポイント        | 説明             |
| -------- | --------------------- | ---------------- |
| GET      | /api/users            | ユーザー一覧取得 |
| GET      | /api/transactions     | 取引一覧取得     |
| POST     | /api/transactions     | 取引新規作成     |
| PUT      | /api/transactions/:id | 取引更新         |
| DELETE   | /api/transactions/:id | 取引削除         |
| GET      | /api/categories       | カテゴリ一覧取得 |

### 5.2 レスポンス例

#### GET /api/transactions

```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "expense",
      "amount": 5000,
      "categoryId": 2,
      "date": "2024-03-10",
      "memo": "スーパー",
      "createdAt": "2024-03-10T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

## 6. 状態管理設計 (Pinia)

### 6.1 useUserStore

- 状態: currentUser, isAuthenticated
- アクション: login, logout, fetchUser

### 6.2 useTransactionStore

- 状態: transactions, loading, error
- アクション: fetchTransactions, addTransaction, updateTransaction, deleteTransaction

### 6.3 useCategoryStore

- 状態: categories
- アクション: fetchCategories, addCategory

## 7. テスト設計

### 7.1 テスト対象

- ユーティリティ関数 (dateUtils.spec.ts)
- Vueコンポーネント (UserCard.spec.ts)
- Piniaストア (userStore.spec.ts)
- APIサービス (apiService.spec.ts)

### 7.2 カバレッジ目標

- 全体: 80%以上
- 関数: 90%以上
- 行: 80%以上

## 8. セキュリティ考慮事項

- JWTトークンによる認証
- APIリクエストのCSRF対策
- ユーザー入力のサニタイズ
- HTTPS通信のみ

## 9. パフォーマンス最適化

- コンポーネントの遅延ロード
- 画像の最適化 (WebP)
- バンドルサイズ監視
- 仮想スクロール (大量データ時)

## 10. デプロイメント

- **プラットフォーム**: Vercel / Netlify
- **CI/CD**: GitHub Actions
- **環境**: 開発 / ステージング / 本番
- **監視**: エラートラッキング (Sentry)
