import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Dashboard', route: 'Dashboard' },
  { label: 'Daily History', route: 'DailyHistory' },
  { label: 'Subscription', route: 'Subscription' },
  { label: 'Profile', route: 'Profile' },
  { label: 'Settings', route: 'Settings' },
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

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
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
    backgroundColor: '#ffffff',
    paddingTop: 60
  },
  header: {
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
    fontWeight: '500'
  },
  menu: {
    flex: 1,
    paddingTop: 12
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  menuItemActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500'
  },
  menuTextActive: {
    color: '#2563eb',
    fontWeight: '700'
  },
  logoutBtn: {
    padding: 20,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca'
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center'
  },
  footer: {
    padding: 20,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#bfdbfe'
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 4
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500'
  }
});

