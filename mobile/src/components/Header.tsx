import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../theme/DarkModeContext';
import { useDynamicStyles } from '../hooks/useDynamicStyles';

type Props = { subtitle?: string };

export default function Header({ subtitle }: Props) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useDarkMode();
  const styles = useDynamicStyles(createStyles);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => (navigation as any).openDrawer()} style={styles.menuBtn}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <View>
          <Text style={styles.title}>HY.YUME</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Profile' as never)} 
        style={styles.profileBtn}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  menuBtn: {
    marginRight: 12,
    padding: 8,
    borderRadius: theme.borderRadius.s,
    backgroundColor: theme.colors.background
  },
  menuIcon: {
    fontSize: 20,
    color: theme.colors.text.primary,
    fontWeight: '700'
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 4
  },
  profileBtn: {
    marginLeft: 12,
    padding: 4
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
  }
});