export type TransactionType = 'expense' | 'income' | 'debt' | 'loan';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  type: TransactionType;
  personId?: string; // For debt/loan transactions
}

export interface Person {
  id: string;
  name: string;
}

export interface DebtLoan {
  id: string;
  personId: string;
  amount: number;
  description: string;
  date: string;
  isDebt: boolean; // true for debt (you owe), false for loan (they owe you)
  isPaid: boolean;
  transactions: string[]; // Transaction IDs related to this debt/loan
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  people: Person[];
  debtsLoans: DebtLoan[];
}