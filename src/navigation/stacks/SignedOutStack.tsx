import {createStackNavigator} from '@react-navigation/stack';
import {Button, Card, H2, Input, Paragraph, Separator, SizableText, YStack} from "tamagui";
import {useNavigation} from "@react-navigation/native";
import {useCallback} from "react";
import {RootStackParams} from "../types";

const SignedOutStack = createStackNavigator<RootStackParams>();

const TestScreen = () => {
  const {navigate} = useNavigation();
  const onBackPress = useCallback(() => {
    navigate('ForgotPassword')
  },[]);
  return  (
    <YStack justifyContent="center" flex={1} padding="$4">
      <Card
        elevate
        padded
        borderRadius="$8"
        animation="bouncy"
        scale={0.5}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
      >
        <Card.Header>

        </Card.Header>
        <Input placeholder="Email" marginVertical="$3" size="$5" borderColor="red"/>
        <SizableText color="red" size="$5">Email entered is invalid</SizableText>
        <Input placeholder="Password" marginVertical="$3" size="$5" borderColor="red"/>
        <SizableText color="red" size="$5">Password entered is invalid</SizableText>
        <SizableText color="red" size="$5">Email/Password incorrect. Try again!</SizableText>
        <Button borderRadius="$8" themeInverse size="$6" marginVertical="$3" onPress={onBackPress}>Register</Button>
        <Separator />
        <Card.Footer>
          <Paragraph size="$6" onPress={() => navigate('SignIn')}>Already member? Sign In</Paragraph>
        </Card.Footer>
      </Card>

    </YStack>
  )
}

export const SignedOutScreens = () => {
  return (
    <SignedOutStack.Navigator >
      <SignedOutStack.Screen name="Register" component={TestScreen} />
      <SignedOutStack.Screen name="SignIn" component={TestScreen} />
      <SignedOutStack.Screen name="ForgotPassword" component={TestScreen} />
    </SignedOutStack.Navigator>
  );
}
