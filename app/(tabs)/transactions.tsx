import { useRouter } from 'expo-router';
import { DollarSign, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import EmptyState from '@/components/EmptyState';
import TransactionItem from '@/components/TransactionItem';
import colors from '@/constants/colors';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { Transaction, TransactionType } from '@/types/finance';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, categories, refreshData } = useFinanceStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleAddTransaction = () => {
    router.push('/transaction/create');
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by type
      if (selectedType !== 'all' && transaction.type !== selectedType) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const category = categories.find(c => c.id === transaction.categoryId);
        const searchLower = searchQuery.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          (category && category.name.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderTransactionItem = useCallback(({ item }: { item: Transaction }) => {
    const category = categories.find(c => c.id === item.categoryId) || categories[0];
    const handleTransactionPress = (transaction: Transaction) => {
      router.push({
        pathname: '/transaction/edit',
        params: { id: transaction.id }
      });
    };
    return (
      <TransactionItem
        transaction={item}
        category={category}
        onPress={handleTransactionPress}
      />
    );
  }, [categories, router]);

  const renderTypeFilter = (type: TransactionType | 'all', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedType === type && { backgroundColor: colors.primary }
      ]}
      onPress={() => setSelectedType(type)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedType === type && { color: 'white' }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No Transactions Yet"
        message="Start tracking your expenses by adding your first transaction."
        buttonText="Add Transaction"
        onPress={handleAddTransaction}
        icon={<DollarSign size={48} color={colors.primary} />}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        {renderTypeFilter('all', 'All')}
        {renderTypeFilter('expense', 'Expenses')}
        {renderTypeFilter('income', 'Income')}
        {renderTypeFilter('debt', 'Debts')}
        {renderTypeFilter('loan', 'Loans')}
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddTransaction}
        testID="add-transaction-button"
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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