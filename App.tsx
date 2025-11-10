import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Animated, Platform} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

/**
 * Type definitions for navigation parameters
 * Defines the structure of data passed between screens
 */
export type RootStackParamList = {
  Home: undefined;
  Detail: {title: string; message: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Cyber night city theme color palette
const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

/**
 * Interpolates between two hex colors based on a ratio (0-1)
 * Used to create smooth color transitions for animations
 * @param color1 - Starting color in hex format (#RRGGBB)
 * @param color2 - Ending color in hex format (#RRGGBB)
 * @param ratio - Interpolation ratio (0 = color1, 1 = color2)
 * @returns Interpolated color in hex format
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
 * Main App Component
 * Sets up navigation and animates header colors with neon blue-purple gradient
 */
const App = () => {
  // Animation value that cycles from 0 to 1 for color interpolation
  const animatedValue = useRef(new Animated.Value(0)).current;
  // State for header border and text colors (animated)
  const [headerBorderColor, setHeaderBorderColor] = React.useState(NEON_BLUE);
  const [headerTintColor, setHeaderTintColor] = React.useState(NEON_BLUE);

  // Animate header colors continuously between neon blue and purple
  useEffect(() => {
    // Create a looping animation that goes from 0 to 1 and back to 0
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false, // Can't use native driver for color animations
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    );

    // Listen to animation value changes and update header colors
    const listener = animatedValue.addListener(({value}) => {
      const color = interpolateColor(NEON_BLUE, NEON_PURPLE, value);
      setHeaderBorderColor(color);
      setHeaderTintColor(color);
    });

    animation.start();

    // Cleanup: stop animation and remove listener on unmount
    return () => {
      animation.stop();
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: headerTintColor, // Animated neon color for primary elements
          background: '#0A0A0F', // Dark background matching cyber theme
          card: '#0A0A0F', // Screen background color
          text: '#E0E0E0', // Light text for readability
          border: headerBorderColor, // Animated border color
          notification: '#00BFFF', // Notification accent color
        },
      }}>
      <Stack.Navigator
        screenOptions={{
          // Header styling with dark cyber theme
          headerStyle: {
            backgroundColor: '#0A0A0F',
          } as any,
          headerTintColor: headerTintColor, // Animated neon color for header text/buttons
          headerTitleStyle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: headerTintColor, // Large animated title
          } as any,
          headerShadowVisible: false, // Remove default shadow
          contentStyle: {
            backgroundColor: '#0A0A0F', // Dark background for all screens
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'App Shortcuts',
            contentStyle: {
              backgroundColor: '#0A0A0F',
            },
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({route}) => ({
            title: route.params?.title || 'Details',
            contentStyle: {
              backgroundColor: '#0A0A0F',
            },
            statusBarStyle: 'light',
            statusBarBackgroundColor: '#0A0A0F',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
