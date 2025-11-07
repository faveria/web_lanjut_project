import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../theme/DarkModeContext';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const menuItems = [
  { label: 'Dashboard', route: 'Dashboard', icon: 'dashboard' },
  { label: 'Daily History', route: 'DailyHistory', icon: 'history' },
  { label: 'Subscription', route: 'Subscription', icon: 'credit-card' },
  { label: 'Profile', route: 'Profile', icon: 'person' },
  { label: 'Settings', route: 'Settings', icon: 'settings' },
];

export default function DrawerContent({ navigation }: any) {
  const { logout, user } = useAuth();
  const { theme } = useDarkMode();
  const route = useNavigationState((state) => state?.routes[state?.index || 0]?.name);
  const currentRoute = route || 'Dashboard';
  const styles = useDynamicStyles(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userRole}>Standard User</Text>
      </View>

      <ScrollView style={styles.menuContainer}>
        <View style={styles.mainMenu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, currentRoute === item.route && styles.activeMenuItem]}
              onPress={() => navigation.navigate(item.route)}
            >
              <Icon name={item.icon} size={20} color={currentRoute === item.route ? theme.colors.primary : theme.colors.text.secondary} style={styles.menuIcon} />
              <Text style={[styles.menuText, currentRoute === item.route && styles.activeMenuText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.accountMenu}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Icon name="logout" size={20} color={theme.colors.status.error} style={styles.menuIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.statusIndicator} />
        <Text style={styles.statusText}>System Status: All sensors operational</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContainer: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 16,
  },
  mainMenu: {
    paddingHorizontal: 16,
  },
  accountMenu: {
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.s,
    marginBottom: 4,
  },
  activeMenuItem: {
    backgroundColor: theme.colors.primary + '20', // 20% opacity
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  activeMenuText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.s,
  },
  logoutText: {
    fontSize: 16,
    color: theme.colors.status.error,
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.status.success,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
});