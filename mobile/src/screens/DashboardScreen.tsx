import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useSensorData } from '../hooks/useSensorData';
import { useAuth } from '../context/AuthContext';
import { pumpAPI } from '../api/client';
import Header from '../components/Header';
import { theme } from '../theme';
import { SENSOR_THRESHOLDS } from '../utils/constants';
import { ActivityIndicator } from 'react-native';

export default function DashboardScreen() {
  const { sensorData, loading, error, refetch } = useSensorData(1000);
  const { logout, user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onPumpToggle = async (status: 'on' | 'off') => {
    try {
      await pumpAPI.controlPump(status);
    } catch {
      // ignore for now
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      return undefined;
    }, [refetch])
  );

  // Calculate system status based on sensor values
  const getSystemStatus = () => {
    if (!sensorData) return { status: 'Unknown', color: '#9ca3af' };
    
    const values = [
      sensorData.ph,
      sensorData.tds,
      sensorData.suhu_air,
      sensorData.suhu_udara,
      sensorData.kelembapan
    ];
    
    const thresholds = [
      SENSOR_THRESHOLDS.ph,
      SENSOR_THRESHOLDS.tds,
      SENSOR_THRESHOLDS.suhu_air,
      SENSOR_THRESHOLDS.suhu_udara,
      SENSOR_THRESHOLDS.kelembapan
    ];
    
    let outOfRangeCount = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== null && values[i] !== undefined) {
        const value = values[i];
        const threshold = thresholds[i];
        if (value < threshold.min || value > threshold.max) {
          outOfRangeCount++;
        }
      }
    }
    
    if (outOfRangeCount === 0) {
      return { status: 'System Optimal', color: '#10b981' };
    } else if (outOfRangeCount <= 2) {
      return { status: 'Some Issues', color: '#f59e0b' };
    } else {
      return { status: 'Critical Issues', color: '#ef4444' };
    }
  };

  const systemStatus = getSystemStatus();

  return (
    <View style={styles.container}>
      <Header subtitle={user?.email || ''} />

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Dashboard</Text>
        </View>

        {/* System Status Card */}
        <View style={styles.systemStatusCard}>
          <View style={styles.systemStatusContent}>
            <View>
              <Text style={styles.systemStatusText}>System Status</Text>
              
              {sensorData && (
                <Text style={styles.lastUpdatedText}>
                  Last updated: {new Date(sensorData.created_at || Date.now()).toLocaleTimeString()}
                </Text>
              )}
            </View>
            
            <View style={styles.connectionContainer}>
              <View style={[styles.connectionIndicator, { backgroundColor: theme.colors.status.success }]} />
              <Text style={styles.connectionText}>Connected</Text>
            </View>
          </View>
        </View>

        {/* Loading indicator */}
        {loading && !sensorData && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading sensor data...</Text>
          </View>
        )}

        {/* Sensor Data Cards Grid */}
        {sensorData && (
          <View style={styles.sensorGrid}>
            {/* pH Level Card */}
            <View style={styles.sensorCard}>
              <View style={styles.sensorCardHeader}>
                <Text style={styles.sensorTitle}>PH LEVEL</Text>
                <Icon name="timeline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.sensorValueContainer}>
                <Text style={styles.sensorValue}>{sensorData.ph?.toFixed(1) || '--'}</Text>
                <Text style={styles.sensorUnit}>pH</Text>
              </View>
              <View style={styles.gaugeContainer}>
                <View style={styles.gauge}>
                  <View style={[styles.gaugeFill, { width: `${((sensorData.ph || 0) - 4) * 10}%` }]} />
                </View>
              </View>
            </View>

            {/* TDS Card */}
            <View style={styles.sensorCard}>
              <View style={styles.sensorCardHeader}>
                <Text style={styles.sensorTitle}>TDS</Text>
                <Icon name="bubble-chart" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.sensorValueContainer}>
                <Text style={styles.sensorValue}>{sensorData.tds?.toFixed(0) || '--'}</Text>
                <Text style={styles.sensorUnit}>PPM</Text>
              </View>
              <View style={styles.gaugeContainer}>
                <View style={styles.gauge}>
                  <View style={[styles.gaugeFill, { width: `${((sensorData.tds || 0) / 2000) * 100}%` }]} />
                </View>
              </View>
            </View>

            {/* Water Temp Card */}
            <View style={styles.sensorCard}>
              <View style={styles.sensorCardHeader}>
                <Text style={styles.sensorTitle}>WATER TEMP</Text>
                <Icon name="water" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.sensorValueContainer}>
                <Text style={styles.sensorValue}>{sensorData.suhu_air?.toFixed(1) || '--'}</Text>
                <Text style={styles.sensorUnit}>°C</Text>
              </View>
              <View style={styles.gaugeContainer}>
                <View style={styles.gauge}>
                  <View style={[styles.gaugeFill, { width: `${((sensorData.suhu_air || 0) - 10) * 5}%` }]} />
                </View>
              </View>
            </View>

            {/* Air Temp Card */}
            <View style={styles.sensorCard}>
              <View style={styles.sensorCardHeader}>
                <Text style={styles.sensorTitle}>AIR TEMP</Text>
                <Icon name="air" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.sensorValueContainer}>
                <Text style={styles.sensorValue}>{sensorData.suhu_udara?.toFixed(1) || '--'}</Text>
                <Text style={styles.sensorUnit}>°C</Text>
              </View>
              <View style={styles.gaugeContainer}>
                <View style={styles.gauge}>
                  <View style={[styles.gaugeFill, { width: `${((sensorData.suhu_udara || 0) - 15) * 4}%` }]} />
                </View>
              </View>
            </View>

            {/* Humidity Card */}
            <View style={styles.sensorCard}>
              <View style={styles.sensorCardHeader}>
                <Text style={styles.sensorTitle}>HUMIDITY</Text>
                <Icon name="opacity" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.sensorValueContainer}>
                <Text style={styles.sensorValue}>{sensorData.kelembapan?.toFixed(1) || '--'}</Text>
                <Text style={styles.sensorUnit}>%</Text>
              </View>
              <View style={styles.gaugeContainer}>
                <View style={styles.gauge}>
                  <View style={[styles.gaugeFill, { width: `${(sensorData.kelembapan || 0) }%` }]} />
                </View>
              </View>
            </View>

            {/* Pump Control Card */}
            <View style={styles.sensorCard}>
              <View style={styles.sensorCardHeader}>
                <Text style={styles.sensorTitle}>PUMP STATUS</Text>
                <Icon name="power" size={20} color={sensorData?.pompa === 'ON' ? theme.colors.status.success : theme.colors.status.error} />
              </View>
              <View style={styles.sensorValueRow}>
                <Text style={[styles.sensorValue, { color: sensorData?.pompa === 'ON' ? theme.colors.status.success : theme.colors.status.error }]}>
                  {sensorData?.pompa || 'OFF'}
                </Text>
                <Switch
                  style={styles.inlineSwitch}
                  value={sensorData?.pompa === 'ON'}
                  onValueChange={(value) => onPumpToggle(value ? 'on' : 'off')}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={sensorData?.pompa === 'ON' ? '#ffffff' : '#f4f4f4'}
                />
              </View>
            </View>
          </View>
        )}


      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with margins

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  content: { 
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.m
  },
  pageHeader: {
    marginBottom: theme.spacing.m
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary
  },
  systemStatusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  systemStatusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  systemStatusText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4
  },
  lastUpdatedText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    marginTop: 4
  },
  connectionContainer: {
    alignItems: 'flex-end'
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginBottom: 4
  },
  connectionText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.m
  },
  sensorCard: {
    width: cardWidth,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  sensorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s
  },
  sensorTitle: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textTransform: 'uppercase'
  },
  sensorValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary
  },
  sensorUnit: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    marginLeft: 4
  },
  gaugeContainer: {
    marginTop: theme.spacing.s
  },
  gauge: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden'
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2
  },
  sensorValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inlineSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl
  },
  loadingText: {
    marginTop: theme.spacing.s,
    color: theme.colors.text.secondary
  },

});