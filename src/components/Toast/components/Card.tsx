import {BannerCard} from "../../Banner/Card";
import {Check} from "../../../icons";
import React, {useEffect, useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {DeviceEventEmitter} from "react-native";

export const ToastCard = () => {
// const headerHeight = useHeaderHeight();
  const [message, setMessage] = useState('');
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }))
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("DISPLAY_TOAST", (msg) => {
      setMessage(msg);
      translateY.value = withTiming(70, {duration: 300});
      opacity.value = withTiming(1, { duration: 300 });
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
      }, 2400);
    });

    return () => subscription.remove();

  }, []);
  return (
    <Animated.View style={[{position: 'absolute', top: 0, zIndex:99, left:10,right:10},animatedStyle]}>
      <BannerCard
        icon={<Check color="green"/>}
        text={message}
        color="green"
      />

    </Animated.View>
  );
}