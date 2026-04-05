export interface Transaction {
  id: number;
  userId: number;
  type: "income" | "expense";
  amount: number;
  categoryId: number;
  date: Date;
  memo?: string;
  createdAt: Date;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}
