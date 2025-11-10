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

/**
 * Props for GridLayout component
 */
interface GridLayoutProps {
  data: AppItem[];
  onItemPress: (item: AppItem) => void;
}

// Calculate grid item width: 2 columns with padding and gap
const screenWidth = Dimensions.get('window').width;
const padding = 16; // Horizontal padding on both sides
const gap = 12; // Gap between grid items
const itemWidth = (screenWidth - padding * 2 - gap) / 2; // Each item takes half width minus gap

// Cyber night city theme colors
const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

/**
 * AnimatedCard Component
 * Individual card in the grid layout with animated icon glow effect
 * Wrapped in RotatingGradientBorder for animated border
 */
const AnimatedCard: React.FC<{
  item: AppItem;
  onPress: () => void;
}> = ({item, onPress}) => {
  // Animation value for icon text shadow color
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animate icon glow color continuously
  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false, // Color animations can't use native driver
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

  // Interpolate icon shadow color between neon blue and purple
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
        activeOpacity={1} // Disable default opacity change on press
      >
        {/* Icon with animated neon glow effect */}
        <Animated.Text
          style={[
            styles.icon,
            {color: item.color, textShadowColor: animatedIconColor},
          ]}>
          {item.icon}
        </Animated.Text>
        {/* App name */}
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    </RotatingGradientBorder>
  );
};

/**
 * GridLayout Component
 * Displays app shortcuts in a 2-column grid layout
 * Each card has an animated rotating gradient border and glowing icon
 */
const GridLayout: React.FC<GridLayoutProps> = ({data, onItemPress}) => {
  const renderItem = ({item}: {item: AppItem}) => (
    <AnimatedCard item={item} onPress={() => onItemPress(item)} />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={2} // 2-column grid layout
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.row} // Style for each row in the grid
      showsVerticalScrollIndicator={false} // Hide scroll indicator
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

