import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = { subtitle?: string };

export default function Header({ subtitle }: Props) {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => (navigation as any).openDrawer()} style={styles.menuBtn}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <View style={styles.left}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <View>
          <Text style={styles.title}>HY.YUME Monitor</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3
  },
  menuBtn: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6'
  },
  menuIcon: {
    fontSize: 22,
    color: '#374151',
    fontWeight: '700'
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb'
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500'
  }
});



