import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, CheckCircle, Trash2 } from 'lucide-react-native';
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

import PersonPicker from '@/components/PersonPicker';
import colors from '@/constants/colors';
import { useFinanceStore } from '@/hooks/useFinanceStore';

export default function EditDebtLoanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { 
    debtsLoans,
    people,
    updateDebtLoan,
    deleteDebtLoan,
    markDebtLoanAsPaid
  } = useFinanceStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isDebt, setIsDebt] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (id) {
      const debtLoan = debtsLoans.find(dl => dl.id === id);
      if (debtLoan) {
        setDescription(debtLoan.description);
        setAmount(debtLoan.amount.toString());
        setIsDebt(debtLoan.isDebt);
        setIsPaid(debtLoan.isPaid);
        setSelectedPersonId(debtLoan.personId);
        setDate(debtLoan.date);
      } else {
        Alert.alert('Error', 'Debt/Loan not found');
        router.back();
      }
    }
  }, [id, debtsLoans, router]);

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

    if (!selectedPersonId) {
      Alert.alert('Error', 'Please select a person');
      return;
    }

    const updatedDebtLoan = {
      id,
      personId: selectedPersonId,
      amount: parseFloat(amount),
      description: description.trim(),
      date,
      isDebt,
      isPaid,
      transactions: debtsLoans.find(dl => dl.id === id)?.transactions || [],
    };

    updateDebtLoan(updatedDebtLoan);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Debt/Loan',
      'Are you sure you want to delete this debt/loan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (id) {
              deleteDebtLoan(id);
              router.back();
            }
          }
        }
      ]
    );
  };

  const handleMarkAsPaid = () => {
    if (id) {
      markDebtLoanAsPaid(id);
      setIsPaid(true);
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
          {isPaid && (
            <View style={styles.paidBanner}>
              <CheckCircle size={20} color={colors.success} />
              <Text style={styles.paidBannerText}>Marked as Paid</Text>
            </View>
          )}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="What is this for?"
            placeholderTextColor={colors.textSecondary}
            editable={!isPaid}
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
              editable={!isPaid}
            />
          </View>

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                isDebt && styles.selectedTypeButton,
                isDebt && { 
                  backgroundColor: colors.debtLight,
                  borderColor: colors.debt,
                }
              ]}
              onPress={() => !isPaid && setIsDebt(true)}
              disabled={isPaid}
            >
              <View style={styles.typeButtonContent}>
                <ArrowUpRight 
                  size={20} 
                  color={isDebt ? colors.debt : colors.textSecondary} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    isDebt && { color: colors.debt }
                  ]}
                >
                  I Owe
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                !isDebt && styles.selectedTypeButton,
                !isDebt && { 
                  backgroundColor: colors.loanLight,
                  borderColor: colors.loan,
                }
              ]}
              onPress={() => !isPaid && setIsDebt(false)}
              disabled={isPaid}
            >
              <View style={styles.typeButtonContent}>
                <ArrowDownLeft 
                  size={20} 
                  color={!isDebt ? colors.loan : colors.textSecondary} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    !isDebt && { color: colors.loan }
                  ]}
                >
                  They Owe Me
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <PersonPicker
            people={people}
            selectedPersonId={selectedPersonId}
            onSelectPerson={(person) => !isPaid && setSelectedPersonId(person.id)}
          />

          {!isPaid && (
            <TouchableOpacity 
              style={styles.markPaidButton}
              onPress={handleMarkAsPaid}
            >
              <CheckCircle size={20} color={colors.success} />
              <Text style={styles.markPaidButtonText}>Mark as Paid</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {!isPaid && (
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
      )}
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
  paidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  paidBannerText: {
    color: colors.success,
    fontWeight: '600',
    marginLeft: 8,
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
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
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
  markPaidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  markPaidButtonText: {
    color: colors.success,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.expenseLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
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