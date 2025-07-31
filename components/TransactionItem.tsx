import { ArrowDownLeft, ArrowUpRight, CreditCard, DollarSign } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { Category, Transaction } from '@/types/finance';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/financeUtils';

interface TransactionItemProps {
  transaction: Transaction;
  category: Category;
  onPress: (transaction: Transaction) => void;
}

export default function TransactionItem({ 
  transaction, 
  category, 
  onPress 
}: TransactionItemProps) {
  const { colors } = useTheme();
  
  const getIcon = () => {
    switch (transaction.type) {
      case 'income':
        return <ArrowDownLeft size={24} color={colors.income} />;
      case 'expense':
        return <ArrowUpRight size={24} color={colors.expense} />;
      case 'debt':
        return <CreditCard size={24} color={colors.debt} />;
      case 'loan':
        return <DollarSign size={24} color={colors.loan} />;
      default:
        return <DollarSign size={24} color={colors.primary} />;
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case 'income':
        return colors.income;
      case 'expense':
        return colors.expense;
      case 'debt':
        return colors.debt;
      case 'loan':
        return colors.loan;
      default:
        return colors.text;
    }
  };

  const getAmountPrefix = () => {
    switch (transaction.type) {
      case 'income':
        return '+';
      case 'expense':
        return '-';
      case 'debt':
        return '-';
      case 'loan':
        return '+';
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    detailsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    description: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    subDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    category: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 8,
    },
    date: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    amount: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(transaction)}
      testID={`transaction-item-${transaction.id}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        {getIcon()}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <View style={styles.subDetails}>
          <Text style={styles.category}>{category.name}</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
      
      <Text style={[styles.amount, { color: getAmountColor() }]}>
        {getAmountPrefix()}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

