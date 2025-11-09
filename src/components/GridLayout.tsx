import React, {useRef} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {AppItem} from '../data/appData';
import RotatingGradientBorder from './RotatingGradientBorder';

interface GridLayoutProps {
  data: AppItem[];
  onItemPress: (item: AppItem) => void;
}

const screenWidth = Dimensions.get('window').width;
const padding = 16;
const gap = 12;
const itemWidth = (screenWidth - padding * 2 - gap) / 2;

const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

const AnimatedCard: React.FC<{
  item: AppItem;
  onPress: () => void;
}> = ({item, onPress}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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

  const animatedIconColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [NEON_BLUE, NEON_PURPLE],
  });

  return (
    <RotatingGradientBorder
      style={styles.cardWrapper}
      borderWidth={2}
      borderRadius={12}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={1}>
        <Animated.Text
          style={[
            styles.icon,
            {color: item.color, textShadowColor: animatedIconColor},
          ]}>
          {item.icon}
        </Animated.Text>
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    </RotatingGradientBorder>
  );
};

const GridLayout: React.FC<GridLayoutProps> = ({data, onItemPress}) => {
  const renderItem = ({item}: {item: AppItem}) => (
    <AnimatedCard item={item} onPress={() => onItemPress(item)} />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: itemWidth,
    marginBottom: gap,
  },
  card: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    textAlign: 'center',
  },
});

export default GridLayout;

