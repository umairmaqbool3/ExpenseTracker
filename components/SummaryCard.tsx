import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/utils/financeUtils';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
}

export default function SummaryCard({ 
  title, 
  amount, 
  icon, 
  color, 
  lightColor 
}: SummaryCardProps) {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      minHeight: 90,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    amount: {
      fontSize: 20,
      fontWeight: '700',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  return (
    <View style={[styles.container, { backgroundColor: lightColor }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.amount, { color }]}>{formatCurrency(amount)}</Text>
      </View>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
    </View>
  );
}

