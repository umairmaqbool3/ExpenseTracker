import { useRouter } from 'expo-router';
import { CreditCard, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import DebtLoanItem from '@/components/DebtLoanItem';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { DebtLoan } from '@/types/finance';
import { calculateTotalDebt, calculateTotalLoans, formatCurrency } from '@/utils/financeUtils';

export default function DebtsLoansScreen() {
  const router = useRouter();
  const { debtsLoans, people, refreshData } = useFinanceStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaid, setShowPaid] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'debt' | 'loan'>('all');

  const totalDebt = calculateTotalDebt(debtsLoans);
  const totalLoans = calculateTotalLoans(debtsLoans);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleAddDebtLoan = () => {
    router.push('/debtloan/create');
  };

  const filteredDebtsLoans = debtsLoans
    .filter(debtLoan => {
      // Filter by paid status
      if (!showPaid && debtLoan.isPaid) {
        return false;
      }
      
      // Filter by type
      if (filterType === 'debt' && !debtLoan.isDebt) {
        return false;
      }
      
      if (filterType === 'loan' && debtLoan.isDebt) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const person = people.find(p => p.id === debtLoan.personId);
        const searchLower = searchQuery.toLowerCase();
        return (
          debtLoan.description.toLowerCase().includes(searchLower) ||
          (person && person.name.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by paid status (unpaid first)
      if (a.isPaid !== b.isPaid) {
        return a.isPaid ? 1 : -1;
      }
      // Then sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const renderDebtLoanItem = useCallback(({ item }: { item: DebtLoan }) => {
    const person = people.find(p => p.id === item.personId) || { id: '', name: 'Unknown' };
    const handleDebtLoanPress = (debtLoan: DebtLoan) => {
      router.push({
        pathname: '/debtloan/edit',
        params: { id: debtLoan.id }
      });
    };
    return (
      <DebtLoanItem
        debtLoan={item}
        person={person}
        onPress={handleDebtLoanPress}
      />
    );
  }, [people, router]);

  if (debtsLoans.length === 0) {
    return (
      <EmptyState
        title="No Debts or Loans"
        message="Start tracking who owes you money and who you owe."
        buttonText="Add Debt/Loan"
        onPress={handleAddDebtLoan}
        icon={<CreditCard size={48} color={colors.primary} />}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>You Owe</Text>
          <Text style={[styles.summaryAmount, { color: colors.debt }]}>
            {formatCurrency(totalDebt)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Owed to You</Text>
          <Text style={[styles.summaryAmount, { color: colors.loan }]}>
            {formatCurrency(totalLoans)}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search debts & loans..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'all' && { color: 'white' }
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'debt' && { backgroundColor: colors.debt }
            ]}
            onPress={() => setFilterType('debt')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'debt' && { color: 'white' }
              ]}
            >
              Debts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'loan' && { backgroundColor: colors.loan }
            ]}
            onPress={() => setFilterType('loan')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'loan' && { color: 'white' }
              ]}
            >
              Loans
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.showPaidContainer}>
          <Text style={styles.showPaidText}>Show Paid</Text>
          <Switch
            value={showPaid}
            onValueChange={setShowPaid}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={showPaid ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      <FlatList
        data={filteredDebtsLoans}
        renderItem={renderDebtLoanItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No debts or loans found</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddDebtLoan}
        testID="add-debt-loan-button"
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  showPaidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPaidText: {
    marginRight: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
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