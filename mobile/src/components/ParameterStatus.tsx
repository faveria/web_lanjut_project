import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Range = { min: number; max: number };

type Props = {
  label: string;
  unit: string;
  value: number | null | undefined;
  optimal: Range;
};

export default function ParameterStatus({ label, unit, value, optimal }: Props) {
  const status = (() => {
    if (value === null || value === undefined) return 'nodata';
    if (value < optimal.min || value > optimal.max) return 'warning';
    const margin = (optimal.max - optimal.min) * 0.1;
    if (value <= optimal.min + margin || value >= optimal.max - margin) return 'caution';
    return 'optimal';
  })();

  const progress = (() => {
    if (value === null || value === undefined) return 0;
    let minRange = 0, maxRange = 100;
    if (label.toLowerCase().includes('temp')) { minRange = 10; maxRange = 35; }
    else if (label.toLowerCase().includes('tds')) { minRange = 0; maxRange = 2000; }
    else if (label.toLowerCase().includes('ph')) { minRange = 4; maxRange = 8; }
    const pct = ((Number(value) - minRange) / (maxRange - minRange)) * 100;
    return Math.max(0, Math.min(100, pct));
  })();

  return (
    <View style={[styles.card, stylesByStatus[status].container]}> 
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={stylesByStatus[status].icon}>●</Text>
        </View>
        <Text style={[styles.label, stylesByStatus[status].text]}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <View>
          <Text style={[styles.value, stylesByStatus[status].text]}>
            {value ?? '-'}<Text style={styles.unit}>{unit}</Text>
          </Text>
          <Text style={[styles.range, stylesByStatus[status].text]}>
            Optimal: {optimal.min}-{optimal.max}{unit}
          </Text>
        </View>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: stylesByStatus[status].bar as string }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#ffffff', 
    borderWidth: 2, 
    borderRadius: 16, 
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  label: { 
    fontSize: 16, 
    fontWeight: '700',
    flex: 1
  },
  valueRow: {
    marginBottom: 12
  },
  value: { 
    fontSize: 32, 
    fontWeight: '800',
    marginBottom: 4
  },
  unit: { 
    fontSize: 18, 
    fontWeight: '500',
    opacity: 0.7
  },
  range: { 
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4
  },
  progressBg: { 
    height: 10, 
    backgroundColor: '#f3f4f6', 
    borderRadius: 9999, 
    overflow: 'hidden',
    marginTop: 8
  },
  progressFill: { 
    height: 10, 
    borderRadius: 9999 
  }
});

const stylesByStatus: any = {
  nodata: { 
    container: { backgroundColor: '#fffbeb', borderColor: '#fde68a' }, 
    text: { color: '#78350f' }, 
    icon: { color: '#f59e0b', fontSize: 12 }, 
    bar: '#f59e0b' 
  },
  warning: { 
    container: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' }, 
    text: { color: '#991b1b' }, 
    icon: { color: '#ef4444', fontSize: 12 }, 
    bar: '#ef4444' 
  },
  caution: { 
    container: { backgroundColor: '#ffedd5', borderColor: '#fdba74' }, 
    text: { color: '#9a3412' }, 
    icon: { color: '#f97316', fontSize: 12 }, 
    bar: '#f97316' 
  },
  optimal: { 
    container: { backgroundColor: '#ecfdf5', borderColor: '#86efac' }, 
    text: { color: '#065f46' }, 
    icon: { color: '#10b981', fontSize: 12 }, 
    bar: '#10b981' 
  }
};



