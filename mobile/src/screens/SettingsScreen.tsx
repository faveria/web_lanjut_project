import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { plantAPI } from '../api/client';
import Header from '../components/Header';

export default function SettingsScreen() {
  const { user } = useAuth();
  const [pollingInterval, setPollingInterval] = useState(3000);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plant Management</Text>
          <Text style={styles.cardSubtitle}>Active Plants: {userPlants.length}</Text>
          {userPlants.length === 0 && (
            <Text style={styles.emptyText}>No plants in your garden yet</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Refresh Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Refresh Interval</Text>
            <Text style={styles.settingValue}>{pollingInterval / 1000}s</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Email Alerts</Text>
            <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Information</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>API Version</Text>
            <Text style={styles.settingValue}>v1.0.0</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Status</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Operational</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16, gap: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  cardSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#9ca3af', fontStyle: 'italic' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  settingLabel: { fontSize: 14, color: '#374151' },
  settingValue: { fontSize: 14, color: '#111827', fontWeight: '500' },
  badge: { backgroundColor: '#10b981', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 9999 },
  badgeText: { color: '#ffffff', fontSize: 12, fontWeight: '600' }
});

