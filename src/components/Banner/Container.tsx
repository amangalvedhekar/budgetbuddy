import {BannerContainerProps} from "./types";
import {H4, useWindowDimensions, XStack, YStack} from "tamagui";
import {createStylesForBanner} from "./styles";
import React, {useLayoutEffect, useState} from "react";
import {ExpandCollapse} from "./ExpandCollapse";
import {useTheme} from "@react-navigation/native";
import {impactAsync, ImpactFeedbackStyle} from "expo-haptics";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {BannerList} from "./List";

export const BannerContainer = ({data, titleHeader, titleMiddleHeader,...rest}: BannerContainerProps) => {
  //#region hooks
  const {width} = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
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

  //#region functions
const getFormattedHeader = (titleMiddleHeader) => {
  if (titleMiddleHeader.actualSpent > titleMiddleHeader.budgetedAmount) {
    return {
      title: `You have overspent`,
      color: 'red',
    };
  } else {
    const number = titleMiddleHeader.budgetedAmount - titleMiddleHeader.actualSpent;
    const formattedNumber = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(number);
    return {
      title: `You have ${formattedNumber} left to spent`,
      color: 'green',
    };
  }
}
  //#endregion

  const {title, color} = getFormattedHeader(titleMiddleHeader);

  return (
    <YStack flex={1} {...rest}>
      <XStack
        marginHorizontal="$3"
        marginVertical="$2"
        justifyContent="flex-start"
        alignItems="center"
      >
        <H4 flex={0.3}>
          {titleHeader}
        </H4>
        <H4
          textWrap="wrap"
          flexWrap="wrap"
          flex={0.5}
          color={color}
        >
          {title}
        </H4>
        <XStack flex={0.2} justifyContent="flex-end">
        <ExpandCollapse
          style={styles.expandCollapse}
          onPress={toggleOpen}
          isOpen={isOpen}
        />
        </XStack>
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
