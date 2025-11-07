import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { useDarkMode } from '../theme/DarkModeContext';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { theme } = useDarkMode();
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.container}>
      <Header subtitle="Account Information" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || user?.email?.split('@')[0] || 'User Profile'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'N/A'}</Text>
        </View>

        {/* Account Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>{user?.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.value}>{user?.id || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Account Type</Text>
            <Text style={styles.value}>Standard User</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>Jan 2024</Text>
          </View>
        </View>

        {/* System Access Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Access</Text>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Dashboard Access</Text>
            <View style={styles.statusBadgeActive}>
              <Text style={styles.statusBadgeText}>Active</Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Real-time Data</Text>
            <View style={styles.statusBadgeActive}>
              <Text style={styles.statusBadgeText}>Enabled</Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>API Access</Text>
            <View style={styles.statusBadgeActive}>
              <Text style={styles.statusBadgeText}>Enabled</Text>
            </View>
          </View>
        </View>

        {/* Subscription Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Subscription Status</Text>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Plan</Text>
            <Text style={styles.value}>Starter</Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.statusBadgeActive}>
              <Text style={styles.statusBadgeText}>Active</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  content: { 
    padding: theme.spacing.m,
    gap: theme.spacing.m
  },
  profileHeader: {
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  avatarContainer: {
    marginBottom: theme.spacing.m
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff'
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs
  },
  profileEmail: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary
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
  statusRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  statusLabel: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.primary 
  },
  statusBadgeActive: { 
    backgroundColor: theme.colors.status.success + '20', // 20% opacity
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 9999 
  },
  statusBadgeText: { 
    color: theme.colors.status.success, 
    fontSize: theme.typography.caption.fontSize, 
    fontWeight: '600' 
  }
});