import {useTheme} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Account as AccountIcon, Home as HomeIcon, History as HistoryIcon, Insights as InsightIcon} from "../../icons";
import {Home, Account, History, Insight} from "../../screens";

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
        component={History}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <HistoryIcon fill={colors.text}/>, }}
      />
      <SignedInStack.Screen
        name="Insights"
        component={Insight}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <InsightIcon fill={colors.text}/>, }}
      />
      <SignedInStack.Screen
        name="Account"
        component={Account}
        options={{tabBarLabelStyle: {fontWeight: '600', fontSize: 16},tabBarIcon: () => <AccountIcon fill={colors.text}/>, }}
      />
    </SignedInStack.Navigator>
  );
}