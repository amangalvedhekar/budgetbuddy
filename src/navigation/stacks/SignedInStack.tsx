import {useTheme} from "@react-navigation/native";
import {useCallback} from "react";
import {Button, Card, H4, YStack} from "tamagui";
import {useAuth} from "../../hooks";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Account, Home as HomeIcon, History, Insights} from "../../icons";
import {Home} from "../../screens/signedIn/Home";

const SignedInStack = createBottomTabNavigator();

export const SignedInScreens = () => {
  const {colors} = useTheme();
  return (
    <SignedInStack.Navigator>
      <SignedInStack.Screen
        name="Home"
        component={Home}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <HomeIcon fill={colors.text}/>, }}
      />
      <SignedInStack.Screen
        name="History"
        component={Home}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <History fill={colors.text}/>, }}
      />
      <SignedInStack.Screen
        name="Insights"
        component={Home}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <Insights fill={colors.text}/>, }}
      />
      <SignedInStack.Screen
        name="account"
        component={Home}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <Account fill={colors.text}/>, }}
      />
    </SignedInStack.Navigator>
  );
}