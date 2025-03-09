import {BannerCardProps} from "./types";
import {Card, Paragraph, XStack} from "tamagui";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {Delete} from "../../icons";
import {useState} from "react";
import {impactAsync, ImpactFeedbackStyle} from "expo-haptics";

export const BannerCard = ({icon, text, color, idx = 0, ...rest}: BannerCardProps) => {
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

  const swipeGesture = Gesture
    .Pan()
    .onStart(() => {
      runOnJS(triggerShowDelete)();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX < 0 ? event.translationX : 0;
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
            borderRadius="$8"
            onLayout={e => {
              setCardHeight(e.nativeEvent.layout.height);
              setDistanceFromTop(e.nativeEvent.layout.y);
            }}
            {...rest}
          >
            <Card.Header>
              <XStack
                justifyContent="space-evenly"
                marginHorizontal="$2"
                alignItems="center"
              >
                <XStack paddingRight="$2">
                  {icon}
                </XStack>

                <Paragraph
                  size="$6"
                  color={color}
                  textWrap="wrap"
                  flexWrap="wrap"
                  paddingRight="$3"
                >
                  {text}
                </Paragraph>
              </XStack>
            </Card.Header>
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