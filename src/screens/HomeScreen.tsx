import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RowsLayout from '../components/RowsLayout';
import GridLayout from '../components/GridLayout';
import {appData} from '../data/appData';

type RootStackParamList = {
  Home: undefined;
  Detail: {title: string; message: string};
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Cyber night city theme colors
const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

/**
 * Interpolates between two hex colors for smooth transitions
 * @param color1 - Starting color (#RRGGBB)
 * @param color2 - Ending color (#RRGGBB)
 * @param ratio - Interpolation value between 0 and 1
 * @returns Interpolated hex color string
 */
const interpolateColor = (color1: string, color2: string, ratio: number) => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};

/**
 * Home Screen Component
 * Main screen displaying app shortcuts in rows or grid layout
 * Features animated toggle buttons and layout switching
 */
const HomeScreen = () => {
  // Current layout mode: 'rows' or 'grid'
  const [layoutMode, setLayoutMode] = useState<'rows' | 'grid'>('rows');
  const navigation = useNavigation<NavigationProp>();
  
  // Animation value for toggle button colors
  const animatedValue = useRef(new Animated.Value(0)).current;
  // Animated colors for toggle container border and active button
  const [borderColor, setBorderColor] = React.useState(NEON_BLUE);
  const [shadowColor, setShadowColor] = React.useState(NEON_BLUE);

  // Animate toggle button colors continuously
  useEffect(() => {
    // Loop animation: 0 -> 1 -> 0
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    );

    // Update colors based on animation value
    const listener = animatedValue.addListener(({value}) => {
      const color = interpolateColor(NEON_BLUE, NEON_PURPLE, value);
      setBorderColor(color);
      setShadowColor(color);
    });

    animation.start();

    return () => {
      animation.stop();
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  /**
   * Handles navigation to detail screen when an app shortcut is pressed
   * @param item - The app item that was clicked
   */
  const handleItemPress = (item: typeof appData[0]) => {
    navigation.navigate('Detail', {
      title: item.name,
      message: item.message,
    });
  };

  // Calculate status bar height for Android (iOS handled by SafeAreaView)
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <View style={[styles.container, {paddingTop: statusBarHeight}]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A0A0F"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Layout toggle buttons with animated border */}
        <View style={[styles.toggleContainer, {borderBottomColor: borderColor, shadowColor}]}>
          {/* Rows layout button */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              // Apply animated colors when this button is active
              layoutMode === 'rows' && {
                backgroundColor: borderColor,
                borderColor: borderColor,
                shadowColor: shadowColor,
              },
            ]}
            onPress={() => setLayoutMode('rows')}>
            <Text
              style={[
                styles.toggleText,
                layoutMode === 'rows' && styles.toggleTextActive,
              ]}>
              Rows
            </Text>
          </TouchableOpacity>
          {/* Grid layout button */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              // Apply animated colors when this button is active
              layoutMode === 'grid' && {
                backgroundColor: borderColor,
                borderColor: borderColor,
                shadowColor: shadowColor,
              },
            ]}
            onPress={() => setLayoutMode('grid')}>
            <Text
              style={[
                styles.toggleText,
                layoutMode === 'grid' && styles.toggleTextActive,
              ]}>
              Grid
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content area: switches between RowsLayout and GridLayout */}
        <View style={styles.content}>
          {layoutMode === 'rows' ? (
            <RowsLayout data={appData} onItemPress={handleItemPress} />
          ) : (
            <GridLayout data={appData} onItemPress={handleItemPress} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  safeArea: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0D0D14',
    borderBottomWidth: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9D9DA8',
  },
  toggleTextActive: {
    color: '#0A0A0F',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default HomeScreen;

