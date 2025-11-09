import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, ViewStyle} from 'react-native';

interface RotatingGradientBorderProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderWidth?: number;
  borderRadius?: number;
}

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

const RotatingGradientBorder: React.FC<RotatingGradientBorderProps> = ({
  children,
  style,
  borderWidth = 2,
  borderRadius = 12,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  // Create 32 border segments for ultra-smooth continuous rotation
  const [borderSegments, setBorderSegments] = React.useState<string[]>(
    Array(32).fill(NEON_BLUE),
  );

  useEffect(() => {
    // Smooth continuous rotation animation
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }),
    );

    const listener = animatedValue.addListener(({value}) => {
      // Create 32 segments around the border for ultra-smooth rotation
      // Each segment is offset by 1/32nd of the rotation for seamless flow
      const segments = Array.from({length: 32}, (_, i) => {
        const phase = (value + i / 32) % 1;
        return interpolateColor(NEON_BLUE, NEON_PURPLE, phase);
      });
      setBorderSegments(segments);
    });

    animation.start();

    return () => {
      animation.stop();
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  // Calculate average color for shadow effect
  const avgColor = React.useMemo(() => {
    const totalR = borderSegments.reduce(
      (sum, color) => sum + parseInt(color.substring(1, 3), 16),
      0,
    );
    const totalG = borderSegments.reduce(
      (sum, color) => sum + parseInt(color.substring(3, 5), 16),
      0,
    );
    const totalB = borderSegments.reduce(
      (sum, color) => sum + parseInt(color.substring(5, 7), 16),
      0,
    );
    const count = borderSegments.length;
    return `#${[totalR / count, totalG / count, totalB / count]
      .map(x => Math.round(x).toString(16).padStart(2, '0'))
      .join('')}`;
  }, [borderSegments]);

  // Render border segments around the full perimeter
  const renderBorderSegments = () => {
    const segments: JSX.Element[] = [];
    const segmentsPerSide = 8; // 8 segments per side = 32 total for smoother rotation

    borderSegments.forEach((color, index) => {
      const side = Math.floor(index / segmentsPerSide);
      const positionInSide = index % segmentsPerSide;
      const segmentWidth = 100 / segmentsPerSide; // Percentage width per segment

      let segmentStyle: any = {
        position: 'absolute',
        backgroundColor: color,
        zIndex: 0,
      };

      // Ensure full coverage by making last segment extend to 100%
      const isLastInSide = positionInSide === segmentsPerSide - 1;
      const segmentLeft = positionInSide * segmentWidth;
      const segmentSize = isLastInSide 
        ? `${100 - segmentLeft}%` // Last segment extends to fill remaining space
        : `${segmentWidth}%`;

      if (side === 0) {
        // Top side - ensure full coverage from 0% to 100%
        segmentStyle = {
          ...segmentStyle,
          top: 0,
          left: `${segmentLeft}%`,
          width: segmentSize,
          height: borderWidth,
          borderTopLeftRadius: positionInSide === 0 ? borderRadius : 0,
          borderTopRightRadius: isLastInSide ? borderRadius : 0,
        };
      } else if (side === 1) {
        // Right side - ensure full coverage from 0% to 100%
        segmentStyle = {
          ...segmentStyle,
          right: 0,
          top: `${segmentLeft}%`,
          width: borderWidth,
          height: segmentSize,
          borderTopRightRadius: positionInSide === 0 ? borderRadius : 0,
          borderBottomRightRadius: isLastInSide ? borderRadius : 0,
        };
      } else if (side === 2) {
        // Bottom side - ensure full coverage from 0% to 100%
        segmentStyle = {
          ...segmentStyle,
          bottom: 0,
          right: `${segmentLeft}%`,
          width: segmentSize,
          height: borderWidth,
          borderBottomRightRadius: positionInSide === 0 ? borderRadius : 0,
          borderBottomLeftRadius: isLastInSide ? borderRadius : 0,
        };
      } else if (side === 3) {
        // Left side - ensure full coverage from 0% to 100%
        segmentStyle = {
          ...segmentStyle,
          left: 0,
          bottom: `${segmentLeft}%`,
          width: borderWidth,
          height: segmentSize,
          borderBottomLeftRadius: positionInSide === 0 ? borderRadius : 0,
          borderTopLeftRadius: isLastInSide ? borderRadius : 0,
        };
      }

      segments.push(<View key={index} style={segmentStyle} />);
    });

    return segments;
  };

  return (
    <View style={[styles.outerContainer, style]}>
      {/* Outer glow layer for extra visual effect */}
      <View
        style={[
          styles.glowLayer,
          {
            borderRadius: borderRadius + borderWidth + 2,
            borderWidth: borderWidth + 2,
            borderColor: avgColor,
            shadowColor: avgColor,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.4,
            shadowRadius: 6,
          },
        ]}
      />
      {/* Main border container with animated segments - fully around */}
      <View
        style={[
          styles.borderContainer,
          {
            borderRadius: borderRadius + borderWidth,
            shadowColor: avgColor,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.8,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}>
        {/* Border segments that fully wrap around */}
        {renderBorderSegments()}
        {/* Inner content container with margin to show border */}
        <View
          style={[
            styles.innerContainer,
            {
              borderRadius,
              margin: borderWidth,
            },
          ]}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
  },
  glowLayer: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  borderContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'visible',
    zIndex: 1,
  },
  innerContainer: {
    backgroundColor: '#1A1A2E',
    overflow: 'hidden',
  },
});

export default RotatingGradientBorder;

