import { Animated, Easing } from 'react-native';

// Fade in animation
export const fadeIn = (animatedValue: Animated.Value) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: 500,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

// Fade out animation
export const fadeOut = (animatedValue: Animated.Value) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: 300,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

// Slide in from right animation
export const slideInFromRight = (animatedValue: Animated.Value) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: 300,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  });
};

// Slide out to right animation
export const slideOutToRight = (animatedValue: Animated.Value) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: 300,
    easing: Easing.in(Easing.quad),
    useNativeDriver: true,
  });
};

// Bounce animation for interactive elements
export const bounce = (animatedValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]);
};

// Pulse animation
export const pulse = (animatedValue: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};