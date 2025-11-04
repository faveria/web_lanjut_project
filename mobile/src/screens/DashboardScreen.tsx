import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSensorData } from '../hooks/useSensorData';
import { useAuth } from '../context/AuthContext';
import { pumpAPI } from '../api/client';
import Header from '../components/Header';
import ParameterStatus from '../components/ParameterStatus';
import { SENSOR_THRESHOLDS } from '../utils/constants';

export default function DashboardScreen() {
  const { sensorData, loading, error, refetch } = useSensorData(1000);
  const { logout, user } = useAuth();

  const onPumpToggle = async (status: 'on' | 'off') => {
    try {
      await pumpAPI.controlPump(status);
    } catch {
      // ignore for now
    }
  };

  return (
    <View style={styles.container}>
      {useFocusEffect(
        useCallback(() => {
          refetch();
          return undefined;
        }, [refetch])
      )}
      <Header subtitle={user?.email || ''} />

      {loading ? <Text style={styles.info}>Loading...</Text> : null}
      {error ? <Text style={[styles.info, styles.error]}>{error}</Text> : null}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryTitle}>System Status</Text>
              <Text style={styles.summarySubtitle}>Real-time monitoring active</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
            </View>
          </View>
          <TouchableOpacity onPress={refetch} style={styles.refreshBtn} activeOpacity={0.7}>
            <Text style={styles.refreshIcon}>🔄</Text>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid2}>
          <ParameterStatus label="pH Level" unit="" value={sensorData?.ph as any} optimal={SENSOR_THRESHOLDS.ph as any} />
          <ParameterStatus label="TDS" unit="ppm" value={sensorData?.tds as any} optimal={SENSOR_THRESHOLDS.tds as any} />
          <ParameterStatus label="Water Temp" unit="°C" value={sensorData?.suhu_air as any} optimal={{ min: SENSOR_THRESHOLDS.suhu_air.min, max: SENSOR_THRESHOLDS.suhu_air.max }} />
          <ParameterStatus label="Air Temp" unit="°C" value={sensorData?.suhu_udara as any} optimal={{ min: SENSOR_THRESHOLDS.suhu_udara.min, max: SENSOR_THRESHOLDS.suhu_udara.max }} />
          <ParameterStatus label="Humidity" unit="%" value={sensorData?.kelembapan as any} optimal={SENSOR_THRESHOLDS.kelembapan as any} />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => onPumpToggle('on')} 
          style={[styles.actionBtn, styles.on]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>💧</Text>
          <Text style={styles.actionText}>Pump ON</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => onPumpToggle('off')} 
          style={[styles.actionBtn, styles.off]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>⏸</Text>
          <Text style={styles.actionText}>Pump OFF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  info: { textAlign: 'center', marginTop: 12, color: '#374151', fontSize: 14 },
  error: { color: '#b91c1c', backgroundColor: '#fee2e2', padding: 12, borderRadius: 12, marginHorizontal: 16 },
  content: { padding: 16, gap: 16 },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e7ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#6b7280'
  },
  statusIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10b981'
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981'
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12
  },
  refreshIcon: {
    fontSize: 18,
    marginRight: 8
  },
  refreshText: { 
    color: '#1d4ed8', 
    fontWeight: '700',
    fontSize: 14
  },
  grid2: { gap: 12 },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 20, 
    backgroundColor: '#ffffff', 
    borderTopWidth: 2, 
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8
  },
  actionBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, 
    paddingHorizontal: 32, 
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 140
  },
  on: { 
    backgroundColor: '#10b981'
  },
  off: { 
    backgroundColor: '#ef4444' 
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8
  },
  actionText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16
  }
});


