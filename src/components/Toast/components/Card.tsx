import {BannerCard} from "../../Banner/Card";
import {Check, Cross, Warning} from "../../../icons";
import React, {useEffect, useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming} from "react-native-reanimated";
import {DeviceEventEmitter} from "react-native";
import {useWindowDimensions} from "tamagui";

export type ToastMessageType = 'success' | 'warning' | 'error'
const defaultToastData: Record<'message'| 'type', string | ToastMessageType> = {
  message: '',
  type: '',
};
export const ToastCard = () => {
  const [toastData, setToastData] = useState(null);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const {height} = useWindowDimensions();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }))
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("DISPLAY_TOAST", (msg) => {
      setToastData({
        message:msg.message,
        type: msg.type,
      });
      translateY.value = withTiming(70, {duration: 300});
      opacity.value = withTiming(1, { duration: 300 });
      setTimeout(() => {
        setToastData(defaultToastData);
        opacity.value = withTiming(0, { duration: 3000 });
        translateY.value = withTiming(height, { duration: 300 });
      }, 3400);
    });

    return () => subscription.remove();

  }, []);
  const toastIcon = {
    success: <Check color="green"/>,
    warning: <Warning color="#8B8000" />,
    error: <Cross color="red" />,
  };
  const toastColor = {
    success: 'green',
    warning: '#8B8000',
    error: 'red',
  };
  return (
    <Animated.View style={[{position: 'absolute', top: 0, zIndex:99, left:10,right:10},animatedStyle]}>
      {toastData && <BannerCard
        icon={toastIcon[toastData.type ?? 'success']}
        text={toastData.message}
        color={toastColor[toastData.type]}
        themeInverse
      />}

    </Animated.View>
  );
}