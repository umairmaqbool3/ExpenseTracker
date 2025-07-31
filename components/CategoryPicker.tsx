import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


import { useTheme } from '@/hooks/useTheme';
import { Category } from '@/types/finance';

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (category: Category) => void;
}

export default function CategoryPicker({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryPickerProps) {

  const { colors } = useTheme();

  const renderCategory = ({ item }: { item: Category }) => {
    const isSelected = selectedCategoryId === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && { backgroundColor: item.color + '30' },
        ]}
        onPress={() => onSelectCategory(item)}
        testID={`category-${item.id}`}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.color + '20' },
          ]}
        >
          {/* We'll use a simple colored circle instead of dynamic icons */}
          <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    listContent: {
      paddingHorizontal: 16,
    },
    categoryItem: {
      alignItems: 'center',
      marginRight: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    colorCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    categoryName: {
      fontSize: 12,
      color: colors.text,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}