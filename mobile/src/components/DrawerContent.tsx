import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

const menuItems = [
  { label: 'Dashboard', route: 'Dashboard', icon: '' },
  { label: 'Daily History', route: 'DailyHistory', icon: '' },
  { label: 'Subscription', route: 'Subscription', icon: '' },
  { label: 'Profile', route: 'Profile', icon: '' },
  { label: 'Settings', route: 'Settings', icon: '' },
];

export default function DrawerContent({ navigation }: any) {
  const { logout, user } = useAuth();
  const route = useNavigationState((state) => state?.routes[state?.index || 0]?.name);
  const currentRoute = route || 'Dashboard';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HY.YUME</Text>
        <Text style={styles.subtitle}>{user?.email || 'User'}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[styles.menuItem, currentRoute === item.route && styles.menuItemActive]}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={[styles.menuText, currentRoute === item.route && styles.menuTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>System Status</Text>
        <Text style={styles.footerSubtext}>All sensors operational</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingTop: 60,
    paddingHorizontal: 16
  },
  header: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 4
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary
  },
  menu: {
    flex: 1,
    paddingTop: 8
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.s,
    marginBottom: 8
  },
  menuItemActive: {
    backgroundColor: theme.colors.primary + '20', // 20% opacity
  },
  menuText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    color: theme.colors.text.primary
  },
  menuTextActive: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  logoutBtn: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fef2f2',
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.status.error + '40', // 40% opacity
    alignItems: 'center'
  },
  logoutText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.status.error
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  footerText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 4,
    textAlign: 'center'
  },
  footerSubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.success,
    textAlign: 'center'
  }
});