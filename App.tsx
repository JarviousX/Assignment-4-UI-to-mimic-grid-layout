import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Animated, Platform} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Detail: {title: string; message: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

// Helper to interpolate colors
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

const App = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [headerBorderColor, setHeaderBorderColor] = React.useState(NEON_BLUE);
  const [headerTintColor, setHeaderTintColor] = React.useState(NEON_BLUE);

  useEffect(() => {
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

    const listener = animatedValue.addListener(({value}) => {
      const color = interpolateColor(NEON_BLUE, NEON_PURPLE, value);
      setHeaderBorderColor(color);
      setHeaderTintColor(color);
    });

    animation.start();

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
          primary: headerTintColor,
          background: '#0A0A0F',
          card: '#0A0A0F',
          text: '#E0E0E0',
          border: headerBorderColor,
          notification: '#00BFFF',
        },
      }}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A0A0F',
          } as any,
          headerTintColor: headerTintColor,
          headerTitleStyle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: headerTintColor,
          } as any,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#0A0A0F',
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
