import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../theme/DarkModeContext';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { userPreferencesAPI } from '../api/client';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode: toggleDarkModeContext, theme } = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification toggle states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smartAutomation, setSmartAutomation] = useState(false);

  // Load saved preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load notification preferences
        const savedEmailAlerts = await SecureStore.getItemAsync('email_alerts');
        const savedPushNotifications = await SecureStore.getItemAsync('push_notifications');
        const savedSmartAutomation = await SecureStore.getItemAsync('smart_automation');
        
        if (savedEmailAlerts !== null) setEmailAlerts(savedEmailAlerts === 'true');
        if (savedPushNotifications !== null) setPushNotifications(savedPushNotifications === 'true');
        if (savedSmartAutomation !== null) setSmartAutomation(savedSmartAutomation === 'true');
        
        // Load preferences from API if user is available
        if (user?.id) {
          await loadUserPreferencesFromAPI(user.id);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };
    
    loadPreferences();
  }, [user]);

  const loadUserPreferencesFromAPI = async (userId: number) => {
    try {
      const response = await userPreferencesAPI.getUserPreferences(userId);
      const preferences = response.data;
      
      if (preferences.emailAlerts !== undefined) setEmailAlerts(preferences.emailAlerts);
      if (preferences.pushNotifications !== undefined) setPushNotifications(preferences.pushNotifications);
      if (preferences.smartAutomation !== undefined) setSmartAutomation(preferences.smartAutomation);
    } catch (error) {
      console.error('Failed to load user preferences from API:', error);
    }
  };

  // Handle theme toggle
  const toggleDarkMode = async () => {
    try {
      await toggleDarkModeContext();
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
    }
  };

  // Handle email alerts toggle
  const toggleEmailAlerts = async (value: boolean) => {
    setEmailAlerts(value);
    
    // Save to SecureStore
    try {
      await SecureStore.setItemAsync('email_alerts', value.toString());
      
      // Save to API if user is available
      if (user?.id) {
        await saveUserPreferenceToAPI(user.id, 'emailAlerts', value);
      }
    } catch (error) {
      console.error('Failed to save email alerts preference:', error);
    }
  };

  // Handle push notifications toggle
  const togglePushNotifications = async (value: boolean) => {
    setPushNotifications(value);
    
    // Save to SecureStore
    try {
      await SecureStore.setItemAsync('push_notifications', value.toString());
      
      // Save to API if user is available
      if (user?.id) {
        await saveUserPreferenceToAPI(user.id, 'pushNotifications', value);
      }
    } catch (error) {
      console.error('Failed to save push notifications preference:', error);
    }
  };

  // Handle smart automation toggle
  const toggleSmartAutomation = async (value: boolean) => {
    setSmartAutomation(value);
    
    // Save to SecureStore
    try {
      await SecureStore.setItemAsync('smart_automation', value.toString());
      
      // Save to API if user is available
      if (user?.id) {
        await saveUserPreferenceToAPI(user.id, 'smartAutomation', value);
      }
    } catch (error) {
      console.error('Failed to save smart automation preference:', error);
    }
  };
  
  const saveUserPreferenceToAPI = async (userId: number, preferenceType: string, value: any) => {
    try {
      setIsLoading(true);
      const preferences = {
        [preferenceType]: value
      };
      await userPreferencesAPI.updateUserPreferences(userId, preferences);
    } catch (error) {
      console.error(`Failed to save ${preferenceType} preference to API:`, error);
      Alert.alert('Error', `Failed to save ${preferenceType} preference. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear all stored preferences
      await SecureStore.deleteItemAsync('user_token');
      await SecureStore.deleteItemAsync('user_data');
      await SecureStore.deleteItemAsync('email_alerts');
      await SecureStore.deleteItemAsync('push_notifications');
      await SecureStore.deleteItemAsync('smart_automation');
      await SecureStore.deleteItemAsync('app_theme');
      
      // Perform logout
      await logout();
      
      // Reset navigation stack to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' as never }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Handle plant management navigation - navigate to Plant Management screen
  const navigateToPlantManagement = () => {
    navigation.navigate('PlantManagement');
  };

  // Handle data refresh settings navigation - navigate to Dashboard for now
  const navigateToRefreshSettings = () => {
    navigation.navigate('Dashboard');
  };

  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingsCard} onPress={navigateToPlantManagement}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="eco" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Plant Management</Text>
                <Text style={styles.cardSubtitle}>Manage your hydroponic plants</Text>
              </View>
              <Icon name="chevron-right" size={24} color={theme.colors.text.secondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="email" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Email Alerts</Text>
                <Text style={styles.cardSubtitle}>Receive email notifications</Text>
              </View>
              <Switch
                value={emailAlerts}
                onValueChange={toggleEmailAlerts}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={emailAlerts ? '#ffffff' : '#f4f4f4'}
              />
            </View>
          </View>

          <View style={styles.settingsCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="notifications" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Push Notifications</Text>
                <Text style={styles.cardSubtitle}>Receive push notifications</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={togglePushNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={pushNotifications ? '#ffffff' : '#f4f4f4'}
              />
            </View>
          </View>

          <View style={styles.settingsCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="auto-awesome" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Smart Automation Alerts</Text>
                <Text style={styles.cardSubtitle}>Automated alerts based on system</Text>
              </View>
              <Switch
                value={smartAutomation}
                onValueChange={toggleSmartAutomation}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={smartAutomation ? '#ffffff' : '#f4f4f4'}
              />
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="dark-mode" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Dark Mode</Text>
                <Text style={styles.cardSubtitle}>Switch between light and dark themes</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f4f4'}
              />
            </View>
          </View>
        </View>

        {/* System Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          
          <TouchableOpacity style={styles.settingsCard} onPress={navigateToRefreshSettings}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="refresh" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Data Refresh Settings</Text>
                <Text style={styles.cardSubtitle}>Manage data refresh intervals</Text>
              </View>
              <Icon name="chevron-right" size={24} color={theme.colors.text.secondary} />
            </View>
          </TouchableOpacity>

          <View style={styles.settingsCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="info" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>API Version</Text>
                <Text style={styles.cardSubtitle}>v1.2.3</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <Icon name="apps" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>App Version</Text>
                <Text style={styles.cardSubtitle}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color={theme.colors.status.error} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

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
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.m,
  },
  content: {
    flex: 1,
    padding: theme.spacing.m,
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
  settingsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  cardSubtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.status.error,
  },
  logoutButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.status.error,
    marginLeft: theme.spacing.s,
  },
});