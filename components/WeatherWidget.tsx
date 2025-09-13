import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WeatherWidgetProps {
  data: any;
}

export function WeatherWidget({ data }: WeatherWidgetProps) {
  const { colors } = useTheme();

  // Extract the actual weather data from the nested structure
  const weatherData = data.output || data;
  const location = weatherData.location || 'Unknown';

  // Convert Fahrenheit to Celsius for display
  const celsius = Math.round(((weatherData.temperature - 32) * 5) / 9);
  const condition = weatherData.condition || 'Mostly cloudy';
  const high = weatherData.high || Math.round(celsius + 4);
  const low = weatherData.low || Math.round(celsius - 4);

  const styles = createWeatherWidgetStyles();

  return (
    <View style={styles.container}>
      {/* Header with temperature and condition */}
      <View style={styles.header}>
        <Text style={styles.temperature}>{celsius}°C</Text>
        <Text style={styles.weatherIcon}>↗</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>

      {/* Location */}
      <Text style={styles.location}>
        {location.charAt(0).toUpperCase() + location.slice(1)}, Serbia
      </Text>

      {/* Day row */}
      <View style={styles.dayRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.dayIcon}>☁</Text>
          <Text style={styles.day}>Friday</Text>
        </View>
        <Text style={styles.dayTemps}>
          {high}° {low}°
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Here&apos;s the weather in{' '}
        {location.charAt(0).toUpperCase() + location.slice(1)} right now:
      </Text>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Conditions: {condition}, around {celsius} °C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Later: Expect some showers this evening, then cloudy overnight with
            temperatures gradually dropping to about 14-16 °C
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Early tomorrow morning: Rain is likely, with lows around 14°C
          </Text>
          <TouchableOpacity style={styles.expandButton}>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>⌄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function createWeatherWidgetStyles() {
  return StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    temperature: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#353740',
      marginRight: 8,
    },
    weatherIcon: {
      fontSize: 16,
      marginRight: 8,
      color: '#6e6e80',
    },
    condition: {
      fontSize: 14,
      color: '#6e6e80',
      flex: 1,
    },
    location: {
      fontSize: 12,
      color: '#8e8ea0',
      marginBottom: 12,
    },
    dayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    day: {
      fontSize: 14,
      color: '#353740',
      fontWeight: '500',
    },
    dayIcon: {
      fontSize: 12,
      marginRight: 4,
      color: '#6e6e80',
    },
    dayTemps: {
      fontSize: 14,
      color: '#6e6e80',
    },
    description: {
      fontSize: 14,
      color: '#353740',
      marginBottom: 8,
      lineHeight: 20,
    },
    details: {
      marginTop: 8,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    bullet: {
      fontSize: 14,
      color: '#6e6e80',
      marginRight: 8,
      marginTop: 2,
    },
    detailText: {
      fontSize: 14,
      color: '#6e6e80',
      flex: 1,
      lineHeight: 20,
    },
    expandButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#f7f7f8',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
  });
}
