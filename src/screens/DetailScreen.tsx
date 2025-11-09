import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Animated, StatusBar, Platform} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

interface DetailScreenProps {
  route: DetailScreenRouteProp;
}

const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

const DetailScreen: React.FC<DetailScreenProps> = ({route}) => {
  const {title, message} = route.params || {title: 'Details', message: ''};
  const animatedValue = useRef(new Animated.Value(0)).current;

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

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [NEON_BLUE, NEON_PURPLE],
  });

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <View style={[styles.container, {paddingTop: statusBarHeight}]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A0A0F"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
        <Animated.Text
          style={[
            styles.title,
            {
              color: animatedColor,
              textShadowColor: animatedColor,
            },
          ]}>
          {title}
        </Animated.Text>
        <Text style={styles.message}>{message}</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 12,
  },
  message: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default DetailScreen;

