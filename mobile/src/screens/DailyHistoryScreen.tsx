import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSensorData } from '../hooks/useSensorData';
import Header from '../components/Header';

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
          <Text style={styles.loading}>Loading...</Text>
        ) : stats ? (
          <>
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
          <Text style={styles.empty}>No data available for this date</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16, gap: 16 },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  dateBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#eff6ff', borderRadius: 8 },
  dateBtnText: { color: '#2563eb', fontWeight: '600' },
  dateText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  loading: { textAlign: 'center', color: '#6b7280', padding: 20 },
  statsGrid: { gap: 12 },
  statCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  statLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#111827' },
  statRange: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  dataPoints: { textAlign: 'center', color: '#6b7280', fontSize: 12 },
  empty: { textAlign: 'center', color: '#9ca3af', padding: 20 }
});

