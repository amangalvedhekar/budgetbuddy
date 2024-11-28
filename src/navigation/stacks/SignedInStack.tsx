import {useTheme} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {
  Account as AccountIcon,
  Home as HomeIcon,
  History as HistoryIcon,
  Insights as InsightIcon,
  Plus,
  Filter
} from "../../icons";
import {Home, Account, History, Insight, Add} from "../../screens";

const SignedInStack = createBottomTabNavigator();

export const SignedInScreens = () => {
  const {colors} = useTheme();
  return (
    <SignedInStack.Navigator
      screenOptions={{headerTitleAlign: 'center'}}
      initialRouteName="History"
    >
      <SignedInStack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabelStyle: {fontWeight: '600', fontSize: 16},
          tabBarIcon: ({focused}) => <HomeIcon fill={focused ? colors.primary : colors.text}/>,
        }}
      />
      <SignedInStack.Screen
        name="History"
        component={History}
        options={
          {
            tabBarLabelStyle: {
              fontWeight: '600',
              fontSize: 16
            },
            tabBarIcon: ({focused}) => <HistoryIcon fill={focused ? colors.primary : colors.text}/>,
            headerRight: () => <Filter fill={colors.text}/>, headerRightContainerStyle: {paddingRight: 16}
          }}
      />

      <SignedInStack.Screen
        name="Add"
        component={Add}
        options={{
          tabBarLabelStyle: {fontWeight: '600', fontSize: 16},
          tabBarIcon: ({focused}) => <Plus fill={focused ? colors.primary : colors.text}/>
        }}
      />

      <SignedInStack.Screen
        name="Insights"
        component={Insight}
        options={{
          tabBarLabelStyle: {fontWeight: '600', fontSize: 16},
          tabBarIcon: ({focused}) => <InsightIcon fill={focused ? colors.primary : colors.text}/>,
        }}
      />
      <SignedInStack.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabelStyle: {fontWeight: '600', fontSize: 16},
          tabBarIcon: ({focused}) => <AccountIcon fill={focused ? colors.primary : colors.text}/>,
        }}
      />
    </SignedInStack.Navigator>
  );
}