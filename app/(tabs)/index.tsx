import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, CreditCard, DollarSign, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import EmptyState from '@/components/EmptyState';
import SummaryCard from '@/components/SummaryCard';
import TransactionItem from '@/components/TransactionItem';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { useTheme } from '@/hooks/useTheme';
import {
  calculateBalance,
  calculateExpenses,
  calculateIncome,
  calculateTotalDebt,
  calculateTotalLoans,
  formatCurrency,
  getCurrentMonthTransactions
} from '@/utils/financeUtils';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    transactions, 
    categories, 
    debtsLoans,
    isLoading,
    refreshData
  } = useFinanceStore();
  
  const [refreshing, setRefreshing] = useState(false);

  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  const balance = calculateBalance(transactions);
  const monthlyExpenses = calculateExpenses(currentMonthTransactions);
  const monthlyIncome = calculateIncome(currentMonthTransactions);
  const totalDebt = calculateTotalDebt(debtsLoans);
  const totalLoans = calculateTotalLoans(debtsLoans);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleAddTransaction = () => {
    router.push('/transaction/create');
  };

  const handleTransactionPress = (transactionId: string) => {
    router.push({
      pathname: '/transaction/edit',
      params: { id: transactionId }
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    balanceContainer: {
      backgroundColor: colors.primary,
      padding: 24,
      alignItems: 'center',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    balanceLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 16,
      marginBottom: 8,
    },
    balanceAmount: {
      color: 'white',
      fontSize: 32,
      fontWeight: '700',
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 24,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    seeAllText: {
      color: colors.primary,
      fontWeight: '500',
    },
    transactionsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 80,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      padding: 24,
    },
    addButton: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  });

  if (transactions.length === 0 && !isLoading) {
    return (
      <EmptyState
        title="Welcome to Expense Tracker"
        message="Start tracking your finances by adding your first transaction."
        buttonText="Add Transaction"
        onPress={handleAddTransaction}
        icon={<DollarSign size={48} color={colors.primary} />}
      />
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <SummaryCard
          title="Monthly Income"
          amount={monthlyIncome}
          icon={<ArrowDownLeft size={24} color={colors.income} />}
          color={colors.income}
          lightColor={colors.incomeLight}
        />
        <SummaryCard
          title="Monthly Expenses"
          amount={monthlyExpenses}
          icon={<ArrowUpRight size={24} color={colors.expense} />}
          color={colors.expense}
          lightColor={colors.expenseLight}
        />
      </View>

      <View style={styles.summaryContainer}>
        <SummaryCard
          title="You Owe"
          amount={totalDebt}
          icon={<CreditCard size={24} color={colors.debt} />}
          color={colors.debt}
          lightColor={colors.debtLight}
        />
        <SummaryCard
          title="Owed to You"
          amount={totalLoans}
          icon={<DollarSign size={24} color={colors.loan} />}
          color={colors.loan}
          lightColor={colors.loanLight}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        {recentTransactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions yet</Text>
        ) : (
          recentTransactions.map(transaction => {
            const category = categories.find(c => c.id === transaction.categoryId) || categories[0];
            return (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                category={category}
                onPress={() => handleTransactionPress(transaction.id)}
              />
            );
          })
        )}
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddTransaction}
        testID="add-transaction-button"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}

