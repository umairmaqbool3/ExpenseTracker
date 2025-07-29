import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
    ChevronRight,
    HelpCircle,
    Info,
    Shield,
    Tag,
    Trash2,
    User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import colors from '@/constants/colors';
import { useFinanceStore } from '@/hooks/useFinanceStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { categories, people, refreshData } = useFinanceStore();
  const [useBiometrics, setUseBiometrics] = useState(false);

  const handleManageCategories = () => {
    // This would navigate to a categories management screen
    // For now, we'll just show the count
    Alert.alert(
      'Categories',
      `You have ${categories.length} categories.`,
      [
        { text: 'Add New', onPress: () => router.push('/category/create') },
        { text: 'OK' }
      ]
    );
  };

  const handleManagePeople = () => {
    // This would navigate to a people management screen
    // For now, we'll just show the count
    Alert.alert(
      'People',
      `You have ${people.length} people.`,
      [
        { text: 'Add New', onPress: () => router.push('/person/create') },
        { text: 'OK' }
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your financial data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await refreshData();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data.');
            }
          }
        }
      ]
    );
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.settingRight}>
        {rightElement || <ChevronRight size={20} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        {renderSettingItem(
          <Tag size={20} color={colors.primary} />,
          'Manage Categories',
          handleManageCategories
        )}
        {renderSettingItem(
          <User size={20} color={colors.primary} />,
          'Manage People',
          handleManagePeople
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        {renderSettingItem(
          <Shield size={20} color={colors.primary} />,
          'Use Biometric Authentication',
          () => setUseBiometrics(!useBiometrics),
          <Switch
            value={useBiometrics}
            onValueChange={setUseBiometrics}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={useBiometrics ? colors.primary : '#f4f3f4'}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {renderSettingItem(
          <Info size={20} color={colors.primary} />,
          'App Version',
          () => {},
          <Text style={styles.versionText}>1.0.0</Text>
        )}
        {renderSettingItem(
          <HelpCircle size={20} color={colors.primary} />,
          'Help & Support',
          () => {}
        )}
      </View>

      <View style={styles.dangerSection}>
        {renderSettingItem(
          <Trash2 size={20} color={colors.error} />,
          'Clear All Data',
          handleClearAllData,
          <Text style={styles.dangerText}>Delete</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  section: {
    backgroundColor: colors.background,
    marginBottom: 16,
    paddingTop: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  settingRight: {
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dangerSection: {
    backgroundColor: colors.background,
    marginBottom: 32,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  dangerText: {
    color: colors.error,
    fontWeight: '600',
  },
});