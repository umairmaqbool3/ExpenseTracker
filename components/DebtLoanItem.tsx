import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '@/constants/colors';
import { DebtLoan, Person } from '@/types/finance';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/financeUtils';

interface DebtLoanItemProps {
  debtLoan: DebtLoan;
  person: Person;
  onPress: (debtLoan: DebtLoan) => void;
}

export default function DebtLoanItem({ 
  debtLoan, 
  person, 
  onPress 
}: DebtLoanItemProps) {
  const isDebt = debtLoan.isDebt;
  const isPaid = debtLoan.isPaid;
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isPaid && styles.paidContainer
      ]} 
      onPress={() => onPress(debtLoan)}
      testID={`debt-loan-item-${debtLoan.id}`}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isDebt ? colors.debtLight : colors.loanLight }
      ]}>
        {isDebt ? (
          <ArrowUpRight size={24} color={colors.debt} />
        ) : (
          <ArrowDownLeft size={24} color={colors.loan} />
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.description} numberOfLines={1}>
          {debtLoan.description}
        </Text>
        <View style={styles.subDetails}>
          <Text style={styles.personName}>
            {isDebt ? `You owe ${person.name}` : `${person.name} owes you`}
          </Text>
          <Text style={styles.date}>{formatDate(debtLoan.date)}</Text>
        </View>
        {isPaid && (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>PAID</Text>
          </View>
        )}
      </View>
      
      <Text style={[
        styles.amount, 
        { color: isDebt ? colors.debt : colors.loan }
      ]}>
        {isDebt ? '-' : '+'}{formatCurrency(debtLoan.amount)}
      </Text>
    </TouchableOpacity>
  );
}

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
  paidContainer: {
    opacity: 0.7,
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
  personName: {
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
  paidBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});