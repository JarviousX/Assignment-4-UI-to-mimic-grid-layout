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

interface RowsLayoutProps {
  data: AppItem[];
  onItemPress: (item: AppItem) => void;
}

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
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </RotatingGradientBorder>
  );
};

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
      showsVerticalScrollIndicator={false}
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

