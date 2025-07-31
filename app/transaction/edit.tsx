import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, CreditCard, DollarSign, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import CategoryPicker from '@/components/CategoryPicker';
import PersonPicker from '@/components/PersonPicker';
import colors from '@/constants/colors';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { TransactionType } from '@/types/finance';

export default function EditTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { 
    transactions,
    categories, 
    people,
    updateTransaction,
    deleteTransaction
  } = useFinanceStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (id) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setDescription(transaction.description);
        setAmount(transaction.amount.toString());
        setType(transaction.type);
        setSelectedCategoryId(transaction.categoryId);
        setSelectedPersonId(transaction.personId || null);
        setDate(transaction.date);
      } else {
        Alert.alert('Error', 'Transaction not found');
        router.back();
      }
    }
  }, [id, transactions, router]);

  const handleUpdate = () => {
    if (!id) return;

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if ((type === 'debt' || type === 'loan') && !selectedPersonId) {
      Alert.alert('Error', 'Please select a person for this debt/loan');
      return;
    }

    const updatedTransaction = {
      id,
      description: description.trim(),
      amount: parseFloat(amount),
      date,
      categoryId: selectedCategoryId,
      type,
      personId: selectedPersonId || undefined,
    };

    updateTransaction(updatedTransaction);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (id) {
              deleteTransaction(id);
              router.back();
            }
          }
        }
      ]
    );
  };

  const renderTypeButton = (
    transactionType: TransactionType,
    label: string,
    icon: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        type === transactionType && styles.selectedTypeButton,
        type === transactionType && { 
          backgroundColor: getTypeColor(transactionType) + '20',
          borderColor: getTypeColor(transactionType),
        }
      ]}
      onPress={() => setType(transactionType)}
    >
      <View style={styles.typeButtonContent}>
        {icon}
        <Text
          style={[
            styles.typeButtonText,
            type === transactionType && { color: getTypeColor(transactionType) }
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getTypeColor = (transactionType: TransactionType): string => {
    switch (transactionType) {
      case 'income': return colors.income;
      case 'expense': return colors.expense;
      case 'debt': return colors.debt;
      case 'loan': return colors.loan;
      default: return colors.primary;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="What was this for?"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.typeButtonsContainer}>
            {renderTypeButton(
              'expense',
              'Expense',
              <ArrowUpRight 
                size={20} 
                color={type === 'expense' ? colors.expense : colors.textSecondary} 
              />
            )}
            {renderTypeButton(
              'income',
              'Income',
              <ArrowDownLeft 
                size={20} 
                color={type === 'income' ? colors.income : colors.textSecondary} 
              />
            )}
            {renderTypeButton(
              'debt',
              'Debt',
              <CreditCard 
                size={20} 
                color={type === 'debt' ? colors.debt : colors.textSecondary} 
              />
            )}
            {renderTypeButton(
              'loan',
              'Loan',
              <DollarSign 
                size={20} 
                color={type === 'loan' ? colors.loan : colors.textSecondary} 
              />
            )}
          </View>

          <CategoryPicker
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(category) => setSelectedCategoryId(category.id)}
          />

          {(type === 'debt' || type === 'loan') && (
            <PersonPicker
              people={people}
              selectedPersonId={selectedPersonId}
              onSelectPerson={(person) => setSelectedPersonId(person.id)}
            />
          )}

          {(type === 'debt' || type === 'loan') && people.length === 0 && (
            <TouchableOpacity 
              style={styles.addPersonButton}
              onPress={() => router.push('/person/create')}
            >
              <Text style={styles.addPersonButtonText}>Add a Person</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Delete Transaction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleUpdate}
        >
          <Text style={styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: colors.text,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    minWidth: '48%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    borderWidth: 2,
  },
  typeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  addPersonButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addPersonButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.expenseLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});