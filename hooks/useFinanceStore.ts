import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { DEFAULT_CATEGORIES } from '@/constants/categories';
import {
    Category,
    DebtLoan,
    FinanceState,
    Person,
    Transaction
} from '@/types/finance';

const STORAGE_KEY = 'finance_data';

const initialState: FinanceState = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  people: [],
  debtsLoans: [],
};

export const [FinanceProvider, useFinanceStore] = createContextHook(() => {
  const [state, setState] = useState<FinanceState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage
  const loadData = async () => {
    try {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData) as FinanceState;
        setState(parsedData);
      } else {
        // Initialize with default categories if no data exists
        setState(initialState);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
      Alert.alert('Error', 'Failed to load your financial data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to AsyncStorage
  const saveData = async (newState: FinanceState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving finance data:', error);
      Alert.alert('Error', 'Failed to save your financial data.');
    }
  };

  // Load data on initial mount
  useEffect(() => {
    loadData();
  }, []);

  // Transactions
  const addTransaction = async (transaction: Transaction) => {
    const newState = {
      ...state,
      transactions: [...state.transactions, transaction],
    };
    setState(newState);
    await saveData(newState);
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    const newState = {
      ...state,
      transactions: state.transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      ),
    };
    setState(newState);
    await saveData(newState);
  };

  const deleteTransaction = async (id: string) => {
    const newState = {
      ...state,
      transactions: state.transactions.filter(t => t.id !== id),
    };
    setState(newState);
    await saveData(newState);
  };

  // Categories
  const addCategory = async (category: Category) => {
    const newState = {
      ...state,
      categories: [...state.categories, category],
    };
    setState(newState);
    await saveData(newState);
  };

  const updateCategory = async (updatedCategory: Category) => {
    const newState = {
      ...state,
      categories: state.categories.map(c => 
        c.id === updatedCategory.id ? updatedCategory : c
      ),
    };
    setState(newState);
    await saveData(newState);
  };

  const deleteCategory = async (id: string) => {
    // Check if category is used in any transactions
    const isUsed = state.transactions.some(t => t.categoryId === id);
    
    if (isUsed) {
      Alert.alert(
        'Cannot Delete',
        'This category is used in transactions. Please reassign those transactions first.'
      );
      return;
    }
    
    const newState = {
      ...state,
      categories: state.categories.filter(c => c.id !== id),
    };
    setState(newState);
    await saveData(newState);
  };

  // People
  const addPerson = async (person: Person) => {
    const newState = {
      ...state,
      people: [...state.people, person],
    };
    setState(newState);
    await saveData(newState);
  };

  const updatePerson = async (updatedPerson: Person) => {
    const newState = {
      ...state,
      people: state.people.map(p => 
        p.id === updatedPerson.id ? updatedPerson : p
      ),
    };
    setState(newState);
    await saveData(newState);
  };

  const deletePerson = async (id: string) => {
    // Check if person is used in any debts/loans
    const isUsed = state.debtsLoans.some(dl => dl.personId === id);
    
    if (isUsed) {
      Alert.alert(
        'Cannot Delete',
        'This person is associated with debts or loans. Please resolve those first.'
      );
      return;
    }
    
    const newState = {
      ...state,
      people: state.people.filter(p => p.id !== id),
    };
    setState(newState);
    await saveData(newState);
  };

  // Debts and Loans
  const addDebtLoan = async (debtLoan: DebtLoan) => {
    const newState = {
      ...state,
      debtsLoans: [...state.debtsLoans, debtLoan],
    };
    setState(newState);
    await saveData(newState);
  };

  const updateDebtLoan = async (updatedDebtLoan: DebtLoan) => {
    const newState = {
      ...state,
      debtsLoans: state.debtsLoans.map(dl => 
        dl.id === updatedDebtLoan.id ? updatedDebtLoan : dl
      ),
    };
    setState(newState);
    await saveData(newState);
  };

  const markDebtLoanAsPaid = async (id: string) => {
    const newState = {
      ...state,
      debtsLoans: state.debtsLoans.map(dl => 
        dl.id === id ? { ...dl, isPaid: true } : dl
      ),
    };
    setState(newState);
    await saveData(newState);
  };

  const deleteDebtLoan = async (id: string) => {
    const newState = {
      ...state,
      debtsLoans: state.debtsLoans.filter(dl => dl.id !== id),
    };
    setState(newState);
    await saveData(newState);
  };

  return {
    ...state,
    isLoading,
    // Transactions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    // Categories
    addCategory,
    updateCategory,
    deleteCategory,
    // People
    addPerson,
    updatePerson,
    deletePerson,
    // Debts and Loans
    addDebtLoan,
    updateDebtLoan,
    markDebtLoanAsPaid,
    deleteDebtLoan,
    // Utilities
    refreshData: loadData,
  };
});