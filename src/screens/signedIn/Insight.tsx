import React, {useLayoutEffect, useRef, useState} from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {Button, Card, Paragraph, ScrollView, useWindowDimensions, View, XStack, YStack} from "tamagui";
import {Check, ChevronDown, ChevronUp, Cross, Warning} from "../../icons";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {useTheme} from "@react-navigation/native";
import {Gesture, GestureDetector,} from "react-native-gesture-handler";
import * as Haptics from 'expo-haptics';
import {BannerContainer} from "../../components/Banner/Container";

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
  const updateButton = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setShowButton(prevState => !prevState);
  }
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
  useLayoutEffect(() => {
    translateY.value = withTiming(-40, {duration: 300});
    setTimeout(() => {
      translateY.value = withTiming(30, {duration: 300});
    }, 200);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));
  const animatedStyleForSwipe = useAnimatedStyle(() => ({
    width: Math.abs(translateX.value),
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));
  return (
    <ScrollView>
      {/*<Button*/}
      {/*  onPress={async () => {*/}
      {/*    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);*/}
      {/*    translateY.value = withTiming(-40, {duration: 300});*/}
      {/*    setIsPositionAbsolute((prev) => !prev);*/}
      {/*    setTimeout(() => {*/}
      {/*      translateY.value = withTiming(30, {duration: 300});*/}
      {/*    }, 200);*/}
      {/*  }}*/}
      {/*  style={{*/}
      {/*    flex: 1,*/}
      {/*    flexDirection: 'row',*/}
      {/*    alignSelf: 'flex-end',*/}
      {/*    position: 'absolute',*/}
      {/*    top: 30,*/}
      {/*    zIndex: 9,*/}
      {/*    backgroundColor: colors.border,*/}
      {/*    borderColor: colors.border,*/}
      {/*    right: 8,*/}
      {/*    borderWidth: StyleSheet.hairlineWidth,*/}
      {/*    borderRadius: 32,*/}
      {/*    alignItems: 'center',*/}
      {/*    alignContent: 'center',*/}
      {/*    justifyContent: 'space-between',*/}
      {/*  }}>*/}
      {/*  {isPositionAbsolute ?*/}
      {/*    <ChevronDown width={32} height={32} color={colors.text}/>*/}
      {/*    :*/}
      {/*    <ChevronUp width={32} height={32} color={colors.text}/>*/}
      {/*  }*/}
      {/*</Button>*/}
      {/*<Animated.View style={[{flexGrow: 1}, animatedStyle]}>*/}
      {/*  <GestureDetector gesture={swipeGesture}>*/}
      {/*    <Animated.View style={animatedStyle2}>*/}
      {/*      {isVisible &&<Card*/}
      {/*        elevate*/}
      {/*        borderRadius="$8"*/}
      {/*        style={[styles.box, styles.box1]}*/}
      {/*        onLayout={e => {*/}
      {/*          heightOfCard.current = e?.nativeEvent?.layout?.height;*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <Card.Header>*/}
      {/*          <XStack*/}
      {/*            justifyContent="space-between"*/}
      {/*            marginHorizontal="$2"*/}
      {/*            alignItems="center"*/}
      {/*          >*/}
      {/*            <XStack paddingRight="$2">*/}
      {/*              <Cross color="red"/>*/}
      {/*            </XStack>*/}
      {/*            <Paragraph*/}
      {/*              size="$6"*/}
      {/*              color="red"*/}
      {/*              textWrap="wrap"*/}
      {/*              flexWrap="wrap"*/}
      {/*              paddingRight="$3"*/}
      {/*            >*/}
      {/*              You spent more than budgeted in Doordash/Uber Eats.*/}
      {/*              Ensure budgeted expense aligns with spend*/}
      {/*            </Paragraph>*/}
      {/*          </XStack>*/}
      {/*        </Card.Header>*/}
      {/*      </Card>}*/}
      {/*    </Animated.View>*/}

      {/*  </GestureDetector>*/}
      {/*  {showButton && isVisible &&<Animated.View style={[{*/}
      {/*    position: "absolute",*/}
      {/*    right: 0,*/}
      {/*    top: 10,*/}
      {/*    bottom: 0,*/}
      {/*    backgroundColor: "red",*/}
      {/*    justifyContent: "center",*/}
      {/*    alignItems: "center",*/}
      {/*    borderRadius: 16,*/}
      {/*    height: heightOfCard.current,*/}
      {/*    zIndex:1,*/}
      {/*  }, animatedStyleForSwipe ]}>*/}
      {/*    <Paragraph color={colors.text}>*/}
      {/*      Delete*/}
      {/*    </Paragraph>*/}
      {/*  </Animated.View>}*/}

      {/*  <Card*/}
      {/*    elevate*/}
      {/*    borderRadius="$8"*/}
      {/*    style={[styles.box, styles.box2]}>*/}
      {/*    <Card.Header>*/}
      {/*      <XStack*/}
      {/*        justifyContent="space-between"*/}
      {/*        marginHorizontal="$2"*/}
      {/*        alignItems="center"*/}
      {/*      >*/}
      {/*        <XStack paddingRight="$2">*/}
      {/*          <Warning color="#8B8000"/>*/}
      {/*        </XStack>*/}
      {/*        <Paragraph*/}
      {/*          size="$6"*/}
      {/*          color="#8B8000"*/}
      {/*          textWrap="wrap"*/}
      {/*          flexWrap="wrap"*/}
      {/*          paddingRight="$3"*/}
      {/*        >*/}
      {/*          Your income came lower than expected for dividends.*/}
      {/*        </Paragraph>*/}
      {/*      </XStack>*/}
      {/*    </Card.Header>*/}
      {/*  </Card>*/}
      {/*  <Card*/}
      {/*    elevate*/}
      {/*    borderRadius="$8"*/}
      {/*    style={[styles.box, styles.box3]}*/}
      {/*  >*/}
      {/*    <Card.Header>*/}
      {/*      <XStack*/}
      {/*        justifyContent="space-between"*/}
      {/*        marginHorizontal="$2"*/}
      {/*        alignItems="center"*/}
      {/*      >*/}
      {/*        <XStack paddingRight="$2">*/}
      {/*          <Check color="green"/>*/}
      {/*        </XStack>*/}
      {/*        <Paragraph*/}
      {/*          size="$6"*/}
      {/*          color="green"*/}
      {/*          textWrap="wrap"*/}
      {/*          flexWrap="wrap"*/}
      {/*          paddingRight="$3"*/}
      {/*        >*/}
      {/*          Great job on staying within budget for subscriptions 🎉*/}
      {/*        </Paragraph>*/}
      {/*      </XStack>*/}
      {/*    </Card.Header>*/}
      {/*  </Card>*/}
      {/*</Animated.View>*/}
      <BannerContainer
        data={[
          {
            text: 'Great job on staying within budget for subscriptions 🎉',
            icon: <Check color="green"/>,
            color: 'green'
          },
          {
            text: 'Your income came lower than expected for dividends.',
            icon: <Warning color="#8B8000" />,
            color: '#8B8000'
          },
          {
            text: 'You spent more than budgeted in Doordash/Uber Eats.',
            icon: <Cross color="red" />,
            color: 'red'
          },
          {
            text: 'You spent more than budgeted in Uber/Lyft.',
            icon: <Cross color="red" />,
            color: 'red'
          },
          // {
          //   text: 'Great job on having expenses within the income 🎉',
          //   icon: <Check color="green"/>,
          //   color: 'green'
          // },
          // {
          //   text: 'Great job on having consistent income this year 🎉',
          //   icon: <Check color="green"/>,
          //   color: 'green'
          // },
        ]}
      />
    </ScrollView>
  );
};

const createStyles = ({width, isPositionAbsolute}: {width: number, isPositionAbsolute: boolean}) => StyleSheet.create({
  container: {
    flex: 1,

  },
  box: {
    width: width - 16,
    position: isPositionAbsolute ? 'absolute' : undefined,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  box1: {
    top: 10,
    left: 0,
  },
  box2: {
    top: 30,
    left: 0,
  },
  box3: {
    top: 50,
    left: 0,
  },
});
