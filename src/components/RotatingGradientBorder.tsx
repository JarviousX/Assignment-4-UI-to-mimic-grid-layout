import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, ViewStyle} from 'react-native';

/**
 * Props for RotatingGradientBorder component
 */
interface RotatingGradientBorderProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderWidth?: number; // Width of the animated border
  borderRadius?: number; // Corner radius for rounded borders
}

// Cyber night city theme colors for gradient animation
const NEON_BLUE = '#00BFFF';
const NEON_PURPLE = '#9D4EDD';

/**
 * Interpolates between two hex colors for smooth gradient transitions
 * @param color1 - Starting color in hex format
 * @param color2 - Ending color in hex format
 * @param ratio - Interpolation value (0 = color1, 1 = color2)
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
 * RotatingGradientBorder Component
 * Creates a continuously rotating gradient border effect around children
 * Uses 32 border segments (8 per side) for smooth, seamless rotation
 * Each segment animates independently to create a "chasing" gradient effect
 */
const RotatingGradientBorder: React.FC<RotatingGradientBorderProps> = ({
  children,
  style,
  borderWidth = 2,
  borderRadius = 12,
}) => {
  // Animation value that cycles from 0 to 1
  const animatedValue = useRef(new Animated.Value(0)).current;
  // Array of 32 colors, one for each border segment
  // 8 segments per side (top, right, bottom, left) = 32 total
  const [borderSegments, setBorderSegments] = React.useState<string[]>(
    Array(32).fill(NEON_BLUE),
  );

  useEffect(() => {
    // Continuous loop animation: smoothly transitions from 0 to 1
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000, // 5 second rotation cycle
        useNativeDriver: false, // Color animations can't use native driver
      }),
    );

    // Update border segment colors as animation progresses
    const listener = animatedValue.addListener(({value}) => {
      // Create 32 segments, each offset by 1/32nd of the rotation
      // This creates a smooth gradient that appears to rotate around the border
      const segments = Array.from({length: 32}, (_, i) => {
        // Each segment has a phase offset to create the rotating effect
        const phase = (value + i / 32) % 1;
        return interpolateColor(NEON_BLUE, NEON_PURPLE, phase);
      });
      setBorderSegments(segments);
    });

    animation.start();

    // Cleanup on unmount
    return () => {
      animation.stop();
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  /**
   * Calculate average color of all border segments for glow/shadow effect
   * This creates a subtle outer glow that matches the current gradient state
   */
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

  /**
   * Renders 32 border segments positioned around the perimeter
   * Segments are arranged: 8 on top, 8 on right, 8 on bottom, 8 on left
   * Each segment has its own animated color to create the rotating gradient effect
   */
  const renderBorderSegments = () => {
    const segments: JSX.Element[] = [];
    const segmentsPerSide = 8; // 8 segments per side = 32 total for smooth rotation

    borderSegments.forEach((color, index) => {
      // Determine which side this segment belongs to (0=top, 1=right, 2=bottom, 3=left)
      const side = Math.floor(index / segmentsPerSide);
      // Position within the side (0 to 7)
      const positionInSide = index % segmentsPerSide;
      // Each segment takes up 12.5% of its side (100% / 8 segments)
      const segmentWidth = 100 / segmentsPerSide;

      let segmentStyle: any = {
        position: 'absolute',
        backgroundColor: color, // Each segment has its own animated color
        zIndex: 0,
      };

      // Ensure full coverage: last segment on each side extends to 100% to prevent gaps
      const isLastInSide = positionInSide === segmentsPerSide - 1;
      const segmentLeft = positionInSide * segmentWidth;
      const segmentSize = isLastInSide 
        ? `${100 - segmentLeft}%` // Last segment fills remaining space
        : `${segmentWidth}%`;

      // Position segment based on which side it's on
      if (side === 0) {
        // Top side - horizontal segments across the top
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

