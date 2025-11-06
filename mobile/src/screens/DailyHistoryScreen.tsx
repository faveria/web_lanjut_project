import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, RefreshControl } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSensorData } from '../hooks/useSensorData';
import Header from '../components/Header';
import { theme } from '../theme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define screen width constant
const screenWidth = Dimensions.get('window').width;

export default function DailyHistoryScreen() {
  const { getHourlyData } = useSensorData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  React.useEffect(() => {
    loadData();
  }, [selectedDate, getHourlyData]);

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Calculate stats for each sensor
  const getStats = (sensorKey: string) => {
    const values = dailyData.filter(d => d[sensorKey] !== undefined).map(d => d[sensorKey]);
    if (values.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, min, max };
  };

  // Prepare chart data for a sensor
  const prepareChartData = (sensorKey: string) => {
    // Return hourly data for the sensor
    return dailyData.map((entry, index) => {
      return {
        hour: index.toString(), // Using index for now, would be actual hour if available
        value: entry[sensorKey] || 0
      };
    });
  };

  // Format date for display (abbreviated)
  const displayDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'short', // abbreviated (e.g., "Thu")
    year: 'numeric',
    month: 'short',   // abbreviated (e.g., "Nov")
    day: 'numeric'
  });

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '0',
      strokeWidth: 2,
      stroke: '#4CAF50'
    }
  };

  return (
    <View style={styles.container}>
      <Header subtitle="Historical Trends" />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadData} 
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Date Selector Card */}
        <View style={styles.dateSelectorCard}>
          <View style={styles.dateRow}>
            <View style={styles.prevCol}>
              <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navButton}>
                <MaterialCommunityIcon name="chevron-left" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateCol}>
              <TouchableOpacity 
                onPress={() => Alert.alert('Date Picker', 'Calendar functionality would open here')}
                style={styles.dateDisplay}
              >
                <Text style={styles.dateDisplayText}>{displayDate}</Text>
                <MaterialIcon name="calendar-today" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.nextCol}>
              <TouchableOpacity onPress={() => changeDate(1)} style={styles.navButton}>
                <MaterialCommunityIcon name="chevron-right" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Water Temperature Card */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Text style={styles.sensorName}>Water Temperature</Text>
            <MaterialIcon name="water" size={24} color={theme.colors.primary} />
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
                datasets: [
                  {
                    data: dailyData.length > 0 
                      ? [dailyData[0]?.suhu_air || 21, dailyData[6]?.suhu_air || 22, dailyData[12]?.suhu_air || 21.5, dailyData[18]?.suhu_air || 23, dailyData[23]?.suhu_air || 22.5]
                      : [21, 22, 21.5, 23, 22.5],
                    strokeWidth: 2,
                  }
                ]
              }}
              width={screenWidth - 48}
              height={200}
              yAxisLabel=""
              yAxisSuffix="°C"
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              withShadow={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              segments={4}
            />
          </View>
          
          {dailyData.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.avgStat}>
                Avg: <Text style={styles.boldValue}>{getStats('suhu_air').avg.toFixed(1)}°C</Text>
              </Text>
              <Text style={styles.rangeStat}>
                Min: {getStats('suhu_air').min.toFixed(1)}° / Max: {getStats('suhu_air').max.toFixed(1)}°
              </Text>
            </View>
          )}
        </View>

        {/* Air Temperature Card */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Text style={styles.sensorName}>Air Temperature</Text>
            <MaterialIcon name="air" size={24} color={theme.colors.primary} />
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
                datasets: [
                  {
                    data: dailyData.length > 0 
                      ? [dailyData[0]?.suhu_udara || 23, dailyData[6]?.suhu_udara || 24, dailyData[12]?.suhu_udara || 23.5, dailyData[18]?.suhu_udara || 25, dailyData[23]?.suhu_udara || 24.5]
                      : [23, 24, 23.5, 25, 24.5],
                    strokeWidth: 2,
                  }
                ]
              }}
              width={screenWidth - 48}
              height={200}
              yAxisLabel=""
              yAxisSuffix="°C"
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`  // Blue for air temp
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              withShadow={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              segments={4}
            />
          </View>
          
          {dailyData.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.avgStat}>
                Avg: <Text style={styles.boldValue}>{getStats('suhu_udara').avg.toFixed(1)}°C</Text>
              </Text>
              <Text style={styles.rangeStat}>
                Min: {getStats('suhu_udara').min.toFixed(1)}° / Max: {getStats('suhu_udara').max.toFixed(1)}°
              </Text>
            </View>
          )}
        </View>

        {/* Humidity Card */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Text style={styles.sensorName}>Humidity</Text>
            <MaterialIcon name="opacity" size={24} color={theme.colors.primary} />
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
                datasets: [
                  {
                    data: dailyData.length > 0 
                      ? [dailyData[0]?.kelembapan || 65, dailyData[6]?.kelembapan || 70, dailyData[12]?.kelembapan || 68.5, dailyData[18]?.kelembapan || 72, dailyData[23]?.kelembapan || 69.5]
                      : [65, 70, 68.5, 72, 69.5],
                    strokeWidth: 2,
                  }
                ]
              }}
              width={screenWidth - 48}
              height={200}
              yAxisLabel=""
              yAxisSuffix="%"
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`  // Orange for humidity
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              withShadow={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              segments={4}
            />
          </View>
          
          {dailyData.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.avgStat}>
                Avg: <Text style={styles.boldValue}>{getStats('kelembapan').avg.toFixed(1)}%</Text>
              </Text>
              <Text style={styles.rangeStat}>
                Min: {getStats('kelembapan').min.toFixed(1)}% / Max: {getStats('kelembapan').max.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>

        {/* TDS Level Card */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Text style={styles.sensorName}>TDS Level</Text>
            <MaterialIcon name="bubble-chart" size={24} color={theme.colors.primary} />
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
                datasets: [
                  {
                    data: dailyData.length > 0 
                      ? [dailyData[0]?.tds || 800, dailyData[6]?.tds || 820, dailyData[12]?.tds || 815, dailyData[18]?.tds || 830, dailyData[23]?.tds || 825]
                      : [800, 820, 815, 830, 825],
                    strokeWidth: 2,
                  }
                ]
              }}
              width={screenWidth - 48}
              height={200}
              yAxisLabel=""
              yAxisSuffix="ppm"
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`  // Purple for TDS
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              withShadow={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              segments={4}
            />
          </View>
          
          {dailyData.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.avgStat}>
                Avg: <Text style={styles.boldValue}>{getStats('tds').avg.toFixed(0)} PPM</Text>
              </Text>
              <Text style={styles.rangeStat}>
                Min: {getStats('tds').min.toFixed(0)} / Max: {getStats('tds').max.toFixed(0)}
              </Text>
            </View>
          )}
        </View>

        {/* pH Level Card */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Text style={styles.sensorName}>pH Level</Text>
            <MaterialIcon name="timeline" size={24} color={theme.colors.primary} />
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
                datasets: [
                  {
                    data: dailyData.length > 0 
                      ? [dailyData[0]?.ph || 6.8, dailyData[6]?.ph || 7.2, dailyData[12]?.ph || 7.0, dailyData[18]?.ph || 7.4, dailyData[23]?.ph || 6.9]
                      : [6.8, 7.2, 7.0, 7.4, 6.9],
                    strokeWidth: 2,
                  }
                ]
              }}
              width={screenWidth - 48}
              height={200}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`  // Cyan for pH
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              withShadow={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              segments={4}
            />
          </View>
          
          {dailyData.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.avgStat}>
                Avg: <Text style={styles.boldValue}>{getStats('ph').avg.toFixed(1)}</Text>
              </Text>
              <Text style={styles.rangeStat}>
                Min: {getStats('ph').min.toFixed(1)} / Max: {getStats('ph').max.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{dailyData.length} data points recorded</Text>
        </View>
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
    paddingBottom: theme.spacing.xl
  },
  dateSelectorCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  prevCol: {
    flex: 0.25,
    alignItems: 'flex-start'
  },
  dateCol: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextCol: {
    flex: 0.25,
    alignItems: 'flex-end'
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.s
  },
  dateDisplayText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary
  },

  dateNavButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  navButton: {
    backgroundColor: theme.colors.primary + '20', // 20% opacity
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.s
  },
  navButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: theme.typography.caption.fontSize
  },
  sensorCard: {
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
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m
  },
  sensorName: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary
  },
  chartContainer: {
    marginBottom: theme.spacing.s
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avgStat: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary
  },
  boldValue: {
    fontWeight: '700',
    color: theme.colors.text.primary
  },
  rangeStat: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.l
  },
  footerText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary
  }
});