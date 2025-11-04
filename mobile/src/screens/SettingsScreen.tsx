import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { plantAPI } from '../api/client';
import Header from '../components/Header';
import { theme } from '../theme';

export default function SettingsScreen() {
  const { user } = useAuth();
  const [pollingInterval, setPollingInterval] = useState(3000);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smartAutomation, setSmartAutomation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userPlants, setUserPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPlants();
  }, [user]);

  const loadPlants = async () => {
    try {
      const res = await plantAPI.getUserPlantSettings(user!.id);
      setUserPlants(res.data.data || []);
    } catch (e) {
      console.error('Error loading plants:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header subtitle="Customize your experience" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Plant Management Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plant Management</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Active Plants</Text>
            <Text style={styles.value}>{userPlants.length}</Text>
          </View>
          {userPlants.length === 0 && (
            <Text style={styles.emptyText}>No plants in your garden yet</Text>
          )}
        </View>

        {/* Data Refresh Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Refresh Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Refresh Interval</Text>
            <Text style={styles.settingValue}>{pollingInterval / 1000}s</Text>
          </View>
        </View>

        {/* Notification Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Email Alerts</Text>
            <Switch 
              value={emailAlerts} 
              onValueChange={setEmailAlerts} 
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }} 
              thumbColor={emailAlerts ? '#ffffff' : '#f4f4f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch 
              value={pushNotifications} 
              onValueChange={setPushNotifications} 
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }} 
              thumbColor={pushNotifications ? '#ffffff' : '#f4f4f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Smart Automation Alerts</Text>
            <Switch 
              value={smartAutomation} 
              onValueChange={setSmartAutomation} 
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }} 
              thumbColor={smartAutomation ? '#ffffff' : '#f4f4f4'}
            />
          </View>
        </View>

        {/* Appearance Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appearance</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode} 
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }} 
              thumbColor={darkMode ? '#ffffff' : '#f4f4f4'}
            />
          </View>
        </View>

        {/* System Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>API Version</Text>
            <Text style={styles.value}>v1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>App Version</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  content: { 
    padding: theme.spacing.m,
    gap: theme.spacing.m
  },
  card: { 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.l, 
    padding: theme.spacing.m, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  cardTitle: { 
    fontSize: theme.typography.h3.fontSize, 
    fontWeight: '600', 
    color: theme.colors.text.primary, 
    marginBottom: theme.spacing.m 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  label: { 
    fontSize: theme.typography.caption.fontSize, 
    color: theme.colors.text.secondary 
  },
  value: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.primary, 
    fontWeight: '500' 
  },
  emptyText: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.disabled, 
    textAlign: 'center', 
    padding: theme.spacing.l 
  },
  settingRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  settingLabel: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.primary 
  },
  settingValue: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.secondary 
  },
  logoutButton: {
    backgroundColor: theme.colors.status.error,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: theme.typography.body.fontSize
  }
});