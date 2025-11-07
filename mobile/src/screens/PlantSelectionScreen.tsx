import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../theme/DarkModeContext';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { plantAPI } from '../api/client';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlantSelectionScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useDarkMode();
  const [allPlants, setAllPlants] = useState<any[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const styles = useDynamicStyles(createStyles);

  useEffect(() => {
    loadAllPlants();
  }, []);

  const loadAllPlants = async () => {
    try {
      setLoading(true);
      const response = await plantAPI.getAllPlantProfiles();
      const plantsData = response.data.data || [];
      setAllPlants(plantsData);
      setFilteredPlants(plantsData);
    } catch (error: any) {
      console.error('Error loading plants:', error);
      setAllPlants([]);
      setFilteredPlants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (!text) {
      setFilteredPlants(allPlants);
    } else {
      const filtered = allPlants.filter((plant: any) =>
        plant.name.toLowerCase().includes(text.toLowerCase()) ||
        plant.category.toLowerCase().includes(text.toLowerCase()) ||
        plant.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  };

  const handleSelectPlant = async (plantId: number) => {
    try {
      // Add the plant to the user's plants
      await plantAPI.addUserPlant(user.id, { plantId });
      
      // Navigate back to plant management screen
      navigation.goBack();
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  const renderPlant = ({ item }: { item: any }) => {
    // Safely extract values to ensure they are strings
    const name = (item.name && typeof item.name === 'string') ? item.name : 'Unknown Plant';
    const category = (item.category && typeof item.category === 'string') ? item.category : '';
    const description = (item.description && typeof item.description === 'string') ? item.description : '';

    return (
      <View style={styles.plantCard}>
        <View style={styles.plantInfo}>
          <Icon name="eco" size={24} color={theme.colors.primary} />
          <View style={styles.plantDetails}>
            <Text style={styles.plantName}>{name}</Text>
            <Text style={styles.plantCategory}>{category}</Text>
            <Text style={styles.plantDescription} numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => handleSelectPlant(item.id)}
        >
          <Icon name="add" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Select Plant</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plants..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading plants...</Text>
          </View>
        ) : filteredPlants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="eco" size={48} color={theme.colors.text.disabled} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No plants found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPlants && Array.isArray(filteredPlants) ? filteredPlants : []}
            renderItem={renderPlant}
            keyExtractor={(item) => {
              // Ensure the key is always a string
              const id = item?.id || item?._id || Math.random().toString();
              return typeof id === 'string' ? id : id.toString();
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.s,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.m,
  },
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  plantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  plantDetails: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  plantName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  plantCategory: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    marginTop: 2,
    marginBottom: 4,
  },
  plantDescription: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  addButton: {
    padding: 8,
    backgroundColor: `${theme.colors.primary}20`,
    borderRadius: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.m,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default PlantSelectionScreen;