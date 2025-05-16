import {BannerCardProps} from "./types";
import {Card, H3, H5, Paragraph, Progress, XStack, YStack} from "tamagui";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {Delete} from "../../icons";
import React, {useState} from "react";
import {impactAsync, ImpactFeedbackStyle} from "expo-haptics";

export const BannerCard = ({icon, text, color, idx = 0, isOpen, ...rest}: BannerCardProps) => {
  const translateX = useSharedValue(0);
  const [cardHeight, setCardHeight] = useState(82);
  const [distanceFromTop, setDistanceFromTop] = useState(10);
  const [showDelete, setShowDelete] = useState(false);

  const triggerShowDelete = async () => {
    await impactAsync(ImpactFeedbackStyle.Medium);
    setShowDelete(true);
  }
  const triggerHideDelete = async () => {
    await impactAsync(ImpactFeedbackStyle.Medium);
    setShowDelete(false);
  }
console.log(distanceFromTop, idx, 'before render');
  const swipeGesture = Gesture
    .Pan()
    .onStart((event) => {
      if (event.translationX < 0 && !isOpen) {
        runOnJS(triggerShowDelete)();
      }

    })
    .onUpdate((event) => {
      translateX.value = event.translationX < 0 && !isOpen ? event.translationX : 0;
    })
    .onEnd(() => {
      runOnJS(triggerHideDelete)();
      translateX.value = withSpring(0);
    })

  const animatedStyleForSwipe = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const animatedStyleForRight = useAnimatedStyle(() => ({
    width: Math.abs(translateX.value),
  }));

  return (
    <>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={animatedStyleForSwipe}>
          <Card
            elevate
            marginVertical="$2"
            padding="$2"
            onLayout={e => {
              setCardHeight(e.nativeEvent.layout.height);
              setDistanceFromTop(e.nativeEvent.layout.y);
            }}
            {...rest}
          >
            <H3>
              Grocery
            </H3>
            {/*<Card.Header>*/}
              {/*<XStack*/}
              {/*  justifyContent="space-evenly"*/}
              {/*  marginHorizontal="$2"*/}
              {/*  alignItems="flex-start"*/}
              {/*>*/}
              {/*  <XStack paddingRight="$2">*/}
              {/*    {icon}*/}
              {/*  </XStack>*/}
              {/*</XStack>*/}
              <Progress value={80} size="$6" themeInverse>
                <Progress.Indicator animation="bouncy" backgroundColor="green" />
              </Progress>
            <YStack paddingHorizontal="$2">
              <H5>
                Spent $44 of $55. you have -$390 left
              </H5>
            </YStack>
            {/*</Card.Header>*/}
          </Card>
        </Animated.View>
      </GestureDetector>
      {showDelete && <Animated.View style={[{
        position: 'absolute',
        right: 0,
        top: idx == 0 ? distanceFromTop : distanceFromTop + (cardHeight * idx),
        height: cardHeight,
        backgroundColor: '#efa68d',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
      }, animatedStyleForRight]}>
        <Delete fill="red"/>
      </Animated.View>}
    </>
  );
}