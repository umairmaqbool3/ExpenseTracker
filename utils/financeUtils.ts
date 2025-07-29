import { DebtLoan, Transaction, TransactionType } from '@/types/finance';
import { getCurrentMonthRange } from './dateUtils';

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === 'income') {
      return total + transaction.amount;
    } else if (transaction.type === 'expense') {
      return total - transaction.amount;
    }
    return total;
  }, 0);
};

export const calculateExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0);
};

export const calculateIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0);
};

export const calculateTotalDebt = (debtsLoans: DebtLoan[]): number => {
  return debtsLoans
    .filter(dl => dl.isDebt && !dl.isPaid)
    .reduce((total, dl) => total + dl.amount, 0);
};

export const calculateTotalLoans = (debtsLoans: DebtLoan[]): number => {
  return debtsLoans
    .filter(dl => !dl.isDebt && !dl.isPaid)
    .reduce((total, dl) => total + dl.amount, 0);
};

export const filterTransactionsByType = (
  transactions: Transaction[],
  type: TransactionType
): Transaction[] => {
  return transactions.filter(t => t.type === type);
};

export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Transaction[] => {
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });
};

export const filterTransactionsByCategory = (
  transactions: Transaction[],
  categoryId: string
): Transaction[] => {
  return transactions.filter(t => t.categoryId === categoryId);
};

export const getCurrentMonthTransactions = (transactions: Transaction[]): Transaction[] => {
  const { start, end } = getCurrentMonthRange();
  return filterTransactionsByDateRange(transactions, start, end);
};

export const calculateCategoryTotals = (
  transactions: Transaction[]
): Record<string, number> => {
  return transactions.reduce((totals, transaction) => {
    if (transaction.type === 'expense') {
      const { categoryId } = transaction;
      totals[categoryId] = (totals[categoryId] || 0) + transaction.amount;
    }
    return totals;
  }, {} as Record<string, number>);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};