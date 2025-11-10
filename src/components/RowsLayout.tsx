import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {AppItem} from '../data/appData';
import RotatingGradientBorder from './RotatingGradientBorder';

/**
 * Props for RowsLayout component
 */
interface RowsLayoutProps {
  data: AppItem[];
  onItemPress: (item: AppItem) => void;
}

// Cyber night city theme colors
const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

/**
 * AnimatedCard Component
 * Individual card in the row layout with animated icon glow effect
 * Wrapped in RotatingGradientBorder for animated border
 * Layout: icon on left, text on right
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
        {/* App name container */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </RotatingGradientBorder>
  );
};

/**
 * RowsLayout Component
 * Displays app shortcuts in a single-column row layout
 * Each card has an animated rotating gradient border and glowing icon
 * Layout: horizontal cards with icon on left, text on right
 */
const RowsLayout: React.FC<RowsLayoutProps> = ({data, onItemPress}) => {
  const renderItem = ({item}: {item: AppItem}) => (
    <AnimatedCard item={item} onPress={() => onItemPress(item)} />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false} // Hide scroll indicator
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
  },
});

export default RowsLayout;

