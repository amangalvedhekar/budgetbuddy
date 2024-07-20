import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useCallback} from "react";
import {Button, Card, H4, YStack} from "tamagui";
import {useAuth} from "../../hooks";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Account, Home, History, Insights} from "../../icons";

const SignedInStack = createBottomTabNavigator();
const TestScreen = () => {
  const {ab, logout} = useAuth();
  const onBackPress = useCallback(async () => {
    await logout();
  },[]);

  return  (
    <YStack justifyContent="flex-start" flex={1} padding="$4">
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
          <H4 size="$6" fontWeight="bold" textAlign="center">
            Welcome user - {ab?.signInDetails?.loginId}
          </H4>
        </Card.Header>
        <Button onPress={onBackPress}>
          Logout
        </Button>
      </Card>

    </YStack>
  )
}
export const SignedInScreens = () => {
  return (
    <SignedInStack.Navigator>
      <SignedInStack.Screen
        name="welcome"
        component={TestScreen}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <Home />, }}
      />
      <SignedInStack.Screen
        name="account"
        component={TestScreen}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <Account/>, }}
      />
      <SignedInStack.Screen
        name="History"
        component={TestScreen}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <History />, }}
      />
      <SignedInStack.Screen
        name="Insights"
        component={TestScreen}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <Insights />, }}
      />
    </SignedInStack.Navigator>
  );
}