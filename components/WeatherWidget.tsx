import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface WeatherWidgetProps {
  data: any;
}

export function WeatherWidget({ data }: WeatherWidgetProps) {
  const { colors } = useTheme();
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState<
    'celsius' | 'fahrenheit'
  >('celsius');

  const weatherData = data.output || data;
  const location = weatherData.location || 'Unknown';

  const celsius = Math.round(((weatherData.temperature - 32) * 5) / 9);
  const condition = weatherData.condition || 'Mostly cloudy';

  const convertToDisplayUnit = (tempInCelsius: number) => {
    return temperatureUnit === 'celsius'
      ? tempInCelsius
      : Math.round((tempInCelsius * 9) / 5 + 32);
  };

  const getUnitSymbol = () => (temperatureUnit === 'celsius' ? '°C' : '°F');

  const high = weatherData.high || Math.round(celsius + 4);
  const low = weatherData.low || Math.round(celsius - 4);

  const displayTemp = convertToDisplayUnit(celsius);
  const displayHigh = convertToDisplayUnit(high);
  const displayLow = convertToDisplayUnit(low);

  const styles = createWeatherWidgetStyles();

  return (
    <View style={styles.container}>
      {/* Header with temperature and condition */}
      <View style={styles.header}>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>
            {displayTemp}
            {getUnitSymbol()}
          </Text>
          <TouchableOpacity
            style={styles.unitButton}
            onPress={() => setIsUnitModalVisible(true)}
          >
            <IconSymbol
              name="chevron.down"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
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
          {displayHigh}° {displayLow}°
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
            Conditions: {condition}, around {displayTemp} {getUnitSymbol()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Later: Expect some showers this evening, then cloudy overnight with
            temperatures gradually dropping to about {convertToDisplayUnit(14)}-
            {convertToDisplayUnit(16)} {getUnitSymbol()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.detailText}>
            Early tomorrow morning: Rain is likely, with lows around{' '}
            {convertToDisplayUnit(14)}
            {getUnitSymbol()}
          </Text>
        </View>
      </View>

      {/* Temperature Unit Selection Modal */}
      <Modal
        visible={isUnitModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUnitModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsUnitModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Temperature Unit</Text>

            <TouchableOpacity
              style={[
                styles.unitOption,
                temperatureUnit === 'celsius' && styles.selectedUnitOption,
              ]}
              onPress={() => {
                setTemperatureUnit('celsius');
                setIsUnitModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  temperatureUnit === 'celsius' &&
                    styles.selectedUnitOptionText,
                ]}
              >
                Celsius (°C)
              </Text>
              {temperatureUnit === 'celsius' && (
                <IconSymbol name="checkmark" size={20} color={colors.accent} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.unitOption,
                temperatureUnit === 'fahrenheit' && styles.selectedUnitOption,
              ]}
              onPress={() => {
                setTemperatureUnit('fahrenheit');
                setIsUnitModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  temperatureUnit === 'fahrenheit' &&
                    styles.selectedUnitOptionText,
                ]}
              >
                Fahrenheit (°F)
              </Text>
              {temperatureUnit === 'fahrenheit' && (
                <IconSymbol name="checkmark" size={20} color={colors.accent} />
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    temperatureContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    temperature: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#353740',
    },
    unitButton: {
      marginLeft: 4,
      padding: 4,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 20,
      margin: 20,
      minWidth: 200,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#353740',
      marginBottom: 16,
      textAlign: 'center',
    },
    unitOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedUnitOption: {
      backgroundColor: '#f0f9ff',
    },
    unitOptionText: {
      fontSize: 16,
      color: '#353740',
    },
    selectedUnitOptionText: {
      fontWeight: '600',
    },
  });
}
