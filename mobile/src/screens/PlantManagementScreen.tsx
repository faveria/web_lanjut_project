import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../theme/DarkModeContext';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import { plantAPI } from '../api/client';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlantManagementScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useDarkMode();
  const [plants, setPlants] = useState<any[]>([]);
  const [userPlants, setUserPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = useDynamicStyles(createStyles);

  useEffect(() => {
    if (user?.id) {
      loadPlantData();
    }
  }, [user]);

  const loadPlantData = async () => {
    try {
      setLoading(true);
      
      // Get all available plant profiles
      const plantsResponse = await plantAPI.getAllPlantProfiles();
      setPlants(plantsResponse.data.data || []);
      
      // Get user's assigned plants
      const userPlantsResponse = await plantAPI.getUserPlantSettings(user.id);
      setUserPlants(userPlantsResponse.data.data || []);
    } catch (error: any) {
      console.error('Failed to load user preferences from API:', error);
      // Still set empty arrays to prevent rendering issues
      setPlants([]);
      setUserPlants([]);
      // Alert only if it's not a 404 error for user plants (which might be normal if no plants added)
      if (error?.response?.status !== 404) {
        Alert.alert('Error', 'Failed to load plant data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlant = () => {
    // Navigate to plant selection screen
    navigation.navigate('PlantSelection' as never);
  };

  const handleRemovePlant = async (userPlantId: number) => {
    try {
      await plantAPI.removeUserPlant(user.id, userPlantId);
      // Refresh the plant list
      loadPlantData();
      Alert.alert('Success', 'Plant removed successfully');
    } catch (error) {
      console.error('Error removing plant:', error);
      Alert.alert('Error', 'Failed to remove plant. Please try again.');
    }
  };

  const renderUserPlant = ({ item }: { item: any }) => {
    // Safely extract values to ensure they are strings
    const plantName = (item.plantName && typeof item.plantName === 'string') 
      ? item.plantName 
      : (item.plant?.name && typeof item.plant?.name === 'string') 
        ? item.plant.name 
        : 'Unknown Plant';
    
    const plantCategory = (item.plant?.category && typeof item.plant?.category === 'string')
      ? item.plant.category
      : 'Plant';

    return (
      <View style={styles.plantCard}>
        <View style={styles.plantInfo}>
          <Icon name="eco" size={24} color={theme.colors.primary} />
          <View style={styles.plantDetails}>
            <Text style={styles.plantName}>{plantName}</Text>
            <Text style={styles.plantType}>{plantCategory}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => item.id ? handleRemovePlant(item.id) : null}
        >
          <Icon name="delete" size={20} color={theme.colors.status.error} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Settings')}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Plant Management</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Plant Section */}
        <TouchableOpacity style={styles.addPlantButton} onPress={handleAddPlant}>
          <Icon name="add" size={24} color={theme.colors.primary} />
          <Text style={styles.addPlantButtonText}>Add New Plant</Text>
        </TouchableOpacity>

        {/* User's Plants Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Plants</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your plants...</Text>
            </View>
          ) : (userPlants && Array.isArray(userPlants) && userPlants.length === 0) ? (
            <View style={styles.emptyContainer}>
              <Icon name="eco" size={48} color={theme.colors.text.disabled} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No plants added yet</Text>
              <Text style={styles.emptySubtext}>Add your first plant to get started</Text>
            </View>
          ) : (
            <FlatList
              data={userPlants && Array.isArray(userPlants) ? userPlants : []}
              renderItem={renderUserPlant}
              keyExtractor={(item) => {
                // Ensure the key is always a string
                const id = item?.id || item?._id || Math.random().toString();
                return typeof id === 'string' ? id : id.toString();
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
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
  content: {
    flex: 1,
    padding: theme.spacing.m,
  },
  addPlantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.m,
  },
  addPlantButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.s,
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
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
    alignItems: 'center',
  },
  plantDetails: {
    marginLeft: theme.spacing.m,
  },
  plantName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  plantType: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
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

export default PlantManagementScreen;