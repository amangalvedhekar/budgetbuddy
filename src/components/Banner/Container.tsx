import {BannerContainerProps} from "./types";
import {useWindowDimensions, XStack, YStack} from "tamagui";
import {createStylesForBanner} from "./styles";
import {useLayoutEffect, useState} from "react";
import {ExpandCollapse} from "./ExpandCollapse";
import {useTheme} from "@react-navigation/native";
import {impactAsync, ImpactFeedbackStyle} from "expo-haptics";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {BannerList} from "./List";

export const BannerContainer = ({data}: BannerContainerProps) => {
  //#region hooks
  const {width} = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(true);
  const {colors} = useTheme();
  const translateYForToggle = useSharedValue(20);
  //#endregion

  //#region callbacks
  const animatedStyleForContainer = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateYForToggle.value,
      }
    ],
  }))
  const styles = createStylesForBanner({width, isOpen, colors});
  const toggleOpen = async () => {
    await impactAsync(ImpactFeedbackStyle.Medium);
    translateYForToggle.value = withTiming(-40, {duration: 300});
    setIsOpen((prev) => !prev);
    setTimeout(() => {
      translateYForToggle.value = withTiming(30, {duration: 300});
    }, 200);
  }
  //#endregion

  //#region sideEffects
  useLayoutEffect(() => {
    translateYForToggle.value = withTiming(-40, {duration: 300});
    setTimeout(() => {
      translateYForToggle.value = withTiming(30, {duration: 300});
    }, 200);
  }, []);
  //#endregion

  return (
    <YStack flex={1}>
      <XStack style={{zIndex: 9}}>
        <ExpandCollapse
          style={styles.expandCollapse}
          onPress={toggleOpen}
          isOpen={isOpen}
        />
      </XStack>
      <Animated.View style={[{flexGrow: 1}, animatedStyleForContainer]}>
        {
          Array.isArray(data)
            ?
            <BannerList
              data={data}
              style={styles}
              isOpen={isOpen}
            />
            :
            (
              <></>
            )
        }
      </Animated.View>
    </YStack>
  );
}
