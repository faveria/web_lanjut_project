import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';

type Range = { min: number; max: number };

type Props = {
  label: string;
  unit: string;
  value: number | null | undefined;
  optimal: Range;
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with margins

export default function ParameterStatus({ label, unit, value, optimal }: Props) {
  const status = (() => {
    if (value === null || value === undefined) return 'nodata';
    if (value < optimal.min || value > optimal.max) return 'warning';
    const margin = (optimal.max - optimal.min) * 0.1;
    if (value <= optimal.min + margin || value >= optimal.max - margin) return 'caution';
    return 'optimal';
  })();

  // Get status-specific styles
  const getStatusStyles = () => {
    switch(status) {
      case 'optimal':
        return {
          container: { borderColor: '#10b981', backgroundColor: '#ecfdf5' },
          text: { color: '#065f46' },
          icon: { backgroundColor: '#10b981' },
          iconText: { color: '#ffffff' },
          statusText: { color: '#10b981' }
        };
      case 'caution':
        return {
          container: { borderColor: '#f59e0b', backgroundColor: '#ffedd5' },
          text: { color: '#9a3412' },
          icon: { backgroundColor: '#f59e0b' },
          iconText: { color: '#ffffff' },
          statusText: { color: '#f59e0b' }
        };
      case 'warning':
        return {
          container: { borderColor: '#ef4444', backgroundColor: '#fee2e2' },
          text: { color: '#991b1b' },
          icon: { backgroundColor: '#ef4444' },
          iconText: { color: '#ffffff' },
          statusText: { color: '#ef4444' }
        };
      default: // nodata
        return {
          container: { borderColor: '#9ca3af', backgroundColor: '#f9fafb' },
          text: { color: '#6b7280' },
          icon: { backgroundColor: '#9ca3af' },
          iconText: { color: '#ffffff' },
          statusText: { color: '#9ca3af' }
        };
    }
  };

  const statusStyles = getStatusStyles();
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  const statusIcon = status === 'optimal' ? '●' : status === 'warning' ? '●' : status === 'caution' ? '●' : '●';

  return (
    <View style={[styles.container, statusStyles.container]}>
      {/* Header with label and icon */}
      <View style={styles.header}>
        <View style={[styles.icon, statusStyles.icon]}>
          <Text style={styles.iconText}>{statusIcon}</Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      
      {/* Value display */}
      <View style={styles.valueContainer}>
        <Text style={[styles.value, statusStyles.text]}>
          {value !== null && value !== undefined ? value : '--'}
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </Text>
      </View>
      
      {/* Status text */}
      <Text style={[styles.statusText, statusStyles.statusText]}>
        {statusText}
      </Text>
      
      {/* Optimal range */}
      <Text style={styles.rangeText}>
        Optimal: {optimal.min}-{optimal.max}{unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    borderWidth: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s
  },
  iconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1
  },
  valueContainer: {
    marginBottom: theme.spacing.xs
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  unit: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    fontWeight: '400'
  },
  statusText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.xs
  },
  rangeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary
  }
});