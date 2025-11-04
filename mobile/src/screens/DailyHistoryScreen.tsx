import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSensorData } from '../hooks/useSensorData';
import Header from '../components/Header';
import { theme } from '../theme';

export default function DailyHistoryScreen() {
  const { getHourlyData } = useSensorData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate, getHourlyData]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getHourlyData(selectedDate);
      setDailyData(data || []);
    } catch (e) {
      console.error('Error loading daily data:', e);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const stats = dailyData.length > 0 ? {
    suhu_air: { avg: dailyData.reduce((sum, d) => sum + (d.suhu_air || 0), 0) / dailyData.length, min: Math.min(...dailyData.map(d => d.suhu_air || 0)), max: Math.max(...dailyData.map(d => d.suhu_air || 0)) },
    suhu_udara: { avg: dailyData.reduce((sum, d) => sum + (d.suhu_udara || 0), 0) / dailyData.length, min: Math.min(...dailyData.map(d => d.suhu_udara || 0)), max: Math.max(...dailyData.map(d => d.suhu_udara || 0)) },
    kelembapan: { avg: dailyData.reduce((sum, d) => sum + (d.kelembapan || 0), 0) / dailyData.length, min: Math.min(...dailyData.map(d => d.kelembapan || 0)), max: Math.max(...dailyData.map(d => d.kelembapan || 0)) },
    tds: { avg: dailyData.reduce((sum, d) => sum + (d.tds || 0), 0) / dailyData.length, min: Math.min(...dailyData.map(d => d.tds || 0)), max: Math.max(...dailyData.map(d => d.tds || 0)) },
    ph: { avg: dailyData.reduce((sum, d) => sum + (d.ph || 0), 0) / dailyData.length, min: Math.min(...dailyData.map(d => d.ph || 0)), max: Math.max(...dailyData.map(d => d.ph || 0)) }
  } : null;

  return (
    <View style={styles.container}>
      <Header subtitle="Historical Trends" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateBtn}>
            <Text style={styles.dateBtnText}>← Prev</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{new Date(selectedDate).toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateBtn}>
            <Text style={styles.dateBtnText}>Next →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading historical data...</Text>
          </View>
        ) : stats ? (
          <>
            <Text style={styles.sectionTitle}>Daily Averages</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Water Temp</Text>
                <Text style={styles.statValue}>{stats.suhu_air.avg.toFixed(1)}°C</Text>
                <Text style={styles.statRange}>{stats.suhu_air.min.toFixed(1)}° - {stats.suhu_air.max.toFixed(1)}°</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Air Temp</Text>
                <Text style={styles.statValue}>{stats.suhu_udara.avg.toFixed(1)}°C</Text>
                <Text style={styles.statRange}>{stats.suhu_udara.min.toFixed(1)}° - {stats.suhu_udara.max.toFixed(1)}°</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Humidity</Text>
                <Text style={styles.statValue}>{stats.kelembapan.avg.toFixed(1)}%</Text>
                <Text style={styles.statRange}>{stats.kelembapan.min.toFixed(1)}% - {stats.kelembapan.max.toFixed(1)}%</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>TDS</Text>
                <Text style={styles.statValue}>{stats.tds.avg.toFixed(0)}</Text>
                <Text style={styles.statRange}>{stats.tds.min.toFixed(0)} - {stats.tds.max.toFixed(0)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>pH</Text>
                <Text style={styles.statValue}>{stats.ph.avg.toFixed(1)}</Text>
                <Text style={styles.statRange}>{stats.ph.min.toFixed(1)} - {stats.ph.max.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.dataPoints}>{dailyData.length} data points recorded</Text>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data available for this date</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  content: { 
    padding: theme.spacing.m,
    gap: theme.spacing.m
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.m
  },
  dateSelector: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.m, 
    borderRadius: theme.borderRadius.m, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  dateBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    backgroundColor: theme.colors.primary + '20', // 20% opacity
    borderRadius: theme.borderRadius.s 
  },
  dateBtnText: { 
    color: theme.colors.primary, 
    fontWeight: '600',
    fontSize: theme.typography.caption.fontSize
  },
  dateText: { 
    fontSize: theme.typography.body.fontSize, 
    fontWeight: '600', 
    color: theme.colors.text.primary 
  },
  loadingContainer: { 
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl
  },
  loadingText: { 
    textAlign: 'center', 
    color: theme.colors.text.secondary, 
    fontSize: theme.typography.body.fontSize
  },
  statsGrid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.m
  },
  statCard: { 
    flexBasis: '48%', // Two cards per row with some gap
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.m, 
    borderRadius: theme.borderRadius.m, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  statLabel: { 
    fontSize: theme.typography.caption.fontSize, 
    color: theme.colors.text.secondary, 
    marginBottom: theme.spacing.xs 
  },
  statValue: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: theme.colors.text.primary 
  },
  statRange: { 
    fontSize: theme.typography.caption.fontSize, 
    color: theme.colors.text.disabled, 
    marginTop: theme.spacing.xs 
  },
  dataPoints: { 
    textAlign: 'center', 
    color: theme.colors.text.secondary, 
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.m
  },
  emptyContainer: { 
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl
  },
  emptyText: { 
    textAlign: 'center', 
    color: theme.colors.text.disabled, 
    fontSize: theme.typography.body.fontSize
  }
});