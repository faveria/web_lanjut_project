import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SENSOR_LABELS, SENSOR_UNITS, SENSOR_THRESHOLDS } from '../utils/constants';

type Props = {
  keyName: keyof typeof SENSOR_LABELS | string;
  value: number | string | null | undefined;
};

export default function SensorCard({ keyName, value }: Props) {
  const label = (SENSOR_LABELS as any)[keyName] || String(keyName);
  const unit = (SENSOR_UNITS as any)[keyName] || '';
  const thresholds = (SENSOR_THRESHOLDS as any)[keyName];

  let status: 'ok' | 'warn' = 'ok';
  if (typeof value === 'number' && thresholds) {
    if (value < thresholds.min || value > thresholds.max) status = 'warn';
  }

  return (
    <View style={[styles.card, status === 'warn' && styles.warn]}> 
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.value}>
        {value ?? '-'} {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  warn: {
    borderColor: '#f59e0b',
    backgroundColor: '#fff7ed'
  },
  title: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827'
  }
});



