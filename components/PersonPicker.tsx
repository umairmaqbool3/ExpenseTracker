import { User } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { Person } from '@/types/finance';

interface PersonPickerProps {
  people: Person[];
  selectedPersonId: string | null;
  onSelectPerson: (person: Person) => void;
}

export default function PersonPicker({
  people,
  selectedPersonId,
  onSelectPerson,
}: PersonPickerProps) {
  const {colors} = useTheme();
  const renderPerson = ({ item }: { item: Person }) => {
    const isSelected = selectedPersonId === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.personItem,
          isSelected && { backgroundColor: colors.primaryLight },
        ]}
        onPress={() => onSelectPerson(item)}
        testID={`person-${item.id}`}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isSelected ? colors.primary + '20' : colors.backgroundSecondary },
          ]}
        >
          <User size={24} color={isSelected ? colors.primary : colors.textSecondary} />
        </View>
        <Text style={[
          styles.personName,
          isSelected && { color: colors.primary, fontWeight: '600' }
        ]}>
          {item.name}
        </Text>
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
    personItem: {
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
    personName: {
      fontSize: 12,
      color: colors.text,
      textAlign: 'center',
    },
    emptyContainer: {
      padding: 16,
      alignItems: 'center',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Person</Text>
      {people.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No people added yet</Text>
        </View>
      ) : (
        <FlatList
          data={people}
          renderItem={renderPerson}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}