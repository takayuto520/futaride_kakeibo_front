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

### 1.5 カラーテーマ

アプリ全体で使用するカラーパレットを定義し、保守性と拡張性を高める。

- **Primary**: 明るい緑系 (#34D399) - メインアクション
- **Primary-light**: 緑系 (#10B981) - ホバー状態
- **Primary-active**: 濃い緑系 (#059669) - 選択/押下状態
- **Secondary**: モノトーン系 (#4B5563) - 補助テキスト
- **Secondary-light**: 薄いモノトーン系 (#F3F4F6) - 軽い背景
- **Accent / Error**: 赤系 (#DC2626) - エラー、危険操作
- **Balance-positive**: 水色系 (#0EA5E9) - 収支プラス文字
- **Balance-negative**: 赤系 (#DC2626) - 収支マイナス文字

グレースケール:

- **Gray-light**: 薄いグレー (#F3F4F6) - 背景、カード
- **Gray**: 中間グレー (#6B7280) - 文字、アイコン
- **Gray-dark**: 濃いグレー (#374151) - 強調文字、枠線

ナビゲーション状態色:

- **Nav-default**: #F0FDF4
- **Nav-hover**: #047857
- **Nav-active**: #059669
- **Nav-active-text**: #FFFFFF
- **Nav-inactive**: #9CA3AF

Tailwind CSS の設定ファイルでカスタムカラーを定義し、セマンティックなクラス名を使用。

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

### 3.1.1 ナビゲーション

- 画面上部にタブメニューを配置
- メニュー項目: ホーム, 入力, グラフ, カテゴリ
- 各メニューにアイコンを表示
  - ホーム: カレンダー
  - 入力: ペン
  - グラフ: 円グラフ
  - カテゴリ: 歯車
- 選択中のタブはハイライト表示
- ホバー時は通常時と異なる背景色・文字色・影を適用
- メニューは常に表示

### 3.2 ホーム画面 (Home.vue)

- 月次収支サマリー
- カレンダー表示（日付ごとの支出額表示）
- 年プルダウン・月プルダウンで任意年月を選択
- 選択月以外の日付は薄い文字色で表示
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
| POST     | /api/categories       | カテゴリ新規作成 |
| PUT      | /api/categories/:id   | カテゴリ更新     |
| DELETE   | /api/categories/:id   | カテゴリ削除     |

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

#### GET /api/categories

```json
{
  "data": [
    {
      "id": 1,
      "name": "食費",
      "type": "expense",
      "color": "#EF4444"
    },
    {
      "id": 2,
      "name": "日用品",
      "type": "expense",
      "color": "#10B981"
    },
    {
      "id": 3,
      "name": "交通費",
      "type": "expense",
      "color": "#3B82F6"
    },
    {
      "id": 4,
      "name": "住居費",
      "type": "expense",
      "color": "#8B5CF6"
    },
    {
      "id": 5,
      "name": "公共料金",
      "type": "expense",
      "color": "#F59E0B"
    },
    {
      "id": 6,
      "name": "交際費",
      "type": "expense",
      "color": "#EC4899"
    }
  ]
}
```

## 6. 状態管理設計 (Pinia)

### 6.1 useUserStore

- 状態: currentUser, isAuthenticated
- アクション: login, logout, fetchUser

### 6.2 useTransactionStore

- 状態: transactions, loading, error
- アクション: fetchTransactions, addTransaction, updateTransaction, deleteTransaction

#### 6.2.1 取引登録フロー（入力画面連携）

- 対象画面: TransactionForm.vue
- フロー:
  1. 入力画面で日付・タイプ・金額・カテゴリ・メモを入力して送信
  2. 画面から `useTransactionStore.addTransaction()` を呼び出し
  3. `addTransaction` 内で `POST /api/transactions` を実行
  4. APIレスポンスで返却された取引データをStoreの `transactions` に追加
  5. 追加後、ホーム画面や取引一覧画面はStoreの更新を自動反映

- エラーハンドリング:
  - APIエラー時はStoreの `error` を更新
  - 呼び出し元画面へ例外を再送出し、入力画面でエラーメッセージを表示

- 日付項目の扱い:
  - APIレスポンスの日付文字列（`date`, `createdAt`）はStoreで `Date` 型へ正規化して保持する

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
