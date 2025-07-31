import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
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

export default function CreateDebtLoanScreen() {
  const router = useRouter();
  const { 
    people,
    addDebtLoan
  } = useFinanceStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isDebt, setIsDebt] = useState(true); // true = debt (you owe), false = loan (they owe you)
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const handleSave = () => {
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

    const newDebtLoan = {
      id: Date.now().toString(),
      personId: selectedPersonId,
      amount: parseFloat(amount),
      description: description.trim(),
      date: new Date().toISOString(),
      isDebt,
      isPaid: false,
      transactions: [],
    };

    addDebtLoan(newDebtLoan);
    router.back();
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
            placeholder="What is this for?"
            placeholderTextColor={colors.textSecondary}
            testID="description-input"
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
              testID="amount-input"
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
              onPress={() => setIsDebt(true)}
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
              onPress={() => setIsDebt(false)}
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
            onSelectPerson={(person) => setSelectedPersonId(person.id)}
          />

          {people.length === 0 && (
            <TouchableOpacity 
              style={styles.addPersonButton}
              onPress={() => router.push('/person/create')}
            >
              <Plus size={20} color={colors.primary} />
              <Text style={styles.addPersonButtonText}>Add a Person</Text>
            </TouchableOpacity>
          )}
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
          onPress={handleSave}
          testID="save-debt-loan-button"
        >
          <Text style={styles.saveButtonText}>Save</Text>
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
  addPersonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  addPersonButtonText: {
    color: colors.primary,
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