import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Pressable, DeviceEventEmitter} from 'react-native';
import {Button, Card, Paragraph, useWindowDimensions, View, XStack, YStack} from "tamagui";
import {Check, ChevronDown, ChevronUp, Cross, Warning} from "../../icons";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {useTheme} from "@react-navigation/native";
import {Gesture, GestureDetector,} from "react-native-gesture-handler";

const SWIPE_THRESHOLD = -125;
export const Insight = () => {
  const {width} = useWindowDimensions();
  const heightOfCard = useRef(0);
  const {colors} = useTheme();
  const [isPositionAbsolute, setIsPositionAbsolute] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const styles = createStyles({width, isPositionAbsolute});
  const translateX = useSharedValue(0); // Shared state for swipe position
  const translateXForSwipe = useSharedValue(0);
  const updateButton = () => setShowButton(prevState => !prevState)
  const onDelete = () => setIsVisible(false);
  const swipeGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(updateButton)();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX < 0 ? event.translationX : 0;
      if(event.translationX < -150) {
        translateXForSwipe.value = 150 - Math.abs(event.translationX);
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        runOnJS(onDelete)();
      } else {
        translateX.value = withSpring(0);
        runOnJS(updateButton)();
      }
    });

  const translateY = useSharedValue(30);

  const animatedStyle = useAnimatedStyle(() => ({
    // opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));
  const animatedStyleForSwipe = useAnimatedStyle(() => ({
    width: Math.abs(translateX.value),
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));
  return (
    <YStack style={styles.container} flex={1}>
      <Pressable
        onPress={() => {

          translateY.value = withTiming(-40, {duration: 300});
          setIsPositionAbsolute((prev) => !prev);
          setTimeout(() => {
            translateY.value = withTiming(30, {duration: 300});
          }, 200);
        }}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignSelf: 'flex-end',
          position: 'absolute',
          top: 30,
          zIndex: 9,
          backgroundColor: colors.border,
          borderColor: colors.border,
          right: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 16,
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'space-between',
        }}>
        {isPositionAbsolute ?
          <ChevronDown width={40} height={40} color={colors.text}/>
          :
          <ChevronUp width={40} height={40} color={colors.text}/>
        }
      </Pressable>
      <Animated.View style={[{flexGrow: 1}, animatedStyle]}>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={animatedStyle2}>
            {isVisible &&<Card
              elevate
              borderRadius="$8"
              style={[styles.box, styles.box1]}
              onLayout={e => {
                heightOfCard.current = e?.nativeEvent?.layout?.height;
                console.log(e?.nativeEvent.layout.height, 'coming')
              }}
            >
              <Card.Header>
                <XStack
                  justifyContent="space-between"
                  marginHorizontal="$2"
                  alignItems="center"
                >
                  <XStack paddingRight="$2">
                    <Cross color="red"/>
                  </XStack>
                  <Paragraph
                    size="$6"
                    color="red"
                    textWrap="wrap"
                    flexWrap="wrap"
                    paddingRight="$3"
                  >
                    You spent more than budgeted in Doordash/Uber Eats.
                    Ensure budgeted expense aligns with spend
                  </Paragraph>
                </XStack>
              </Card.Header>
            </Card>}
          </Animated.View>

        </GestureDetector>
        {showButton && isVisible &&<Animated.View style={[{
          position: "absolute",
          right: 0,
          top: 10,
          bottom: 0,
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
          height: heightOfCard.current,
          zIndex:1,
        }, animatedStyleForSwipe ]}>
          <Paragraph color={colors.text}>
            Delete
          </Paragraph>
        </Animated.View>}

        <Card
          elevate
          animation="bouncy"
          borderRadius="$8"
          scale={0.5}
          pressStyle={{scale: 0.875}}
          style={[styles.box, styles.box2]}>
          <Card.Header>
            <XStack
              justifyContent="space-between"
              marginHorizontal="$2"
              alignItems="center"
            >
              <XStack paddingRight="$2">
                <Warning color="#8B8000"/>
              </XStack>
              <Paragraph
                size="$6"
                color="#8B8000"
                textWrap="wrap"
                flexWrap="wrap"
                paddingRight="$3"
              >
                Your income came lower than expected for dividends. Ensure stocks that are bought have good dividend track record
              </Paragraph>
            </XStack>
          </Card.Header>
        </Card>
        <Card
          elevate
          animation="bouncy"
          borderRadius="$8"
          scale={0.5}
          pressStyle={{scale: 0.875}}
          style={[styles.box, styles.box3]}
        >
          <Card.Header>
            <XStack
              justifyContent="space-between"
              marginHorizontal="$2"
              alignItems="center"
            >
              <XStack paddingRight="$2">
                <Check color="green"/>
              </XStack>
              <Paragraph
                size="$6"
                color="green"
                textWrap="wrap"
                flexWrap="wrap"
                paddingRight="$3"
              >
                Great job on staying within budget for subscriptions 🎉
              </Paragraph>
            </XStack>
          </Card.Header>
        </Card>
      </Animated.View>

    </YStack>
  );
};

const createStyles = ({width, isPositionAbsolute}) => StyleSheet.create({
  container: {
    flex: 1,

  },
  box: {
    width: width - 16,
    position: isPositionAbsolute ? 'absolute' : undefined,
    justifyContent: 'center',
    marginHorizontal: 8,
    // marginTop: 8,
  },
  box1: {
    // backgroundColor: 'red',
    top: 10,
    left: 0,
  },
  box2: {
    // backgroundColor: 'orange',
    top: 30,
    left: 0,
  },
  box3: {
    // backgroundColor: 'green',
    top: 50,
    left: 0,
  },
});
