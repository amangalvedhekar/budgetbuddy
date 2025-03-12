import {useTheme} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {
  Account as AccountIcon,
  Home as HomeIcon,
  History as HistoryIcon,
  Insights as InsightIcon,
  Plus,
} from "../../icons";
import {Home, Account, History, Insight, Add} from "../../screens";
import {createStackNavigator} from "@react-navigation/stack";
import {AddCategory} from "../../screens/signedIn/AddCategory";
import {PlannedBudget} from "../../screens/signedIn/PlannedBudget";
import {EstimatedIncome} from "../../screens/signedIn/EstimatedIncome";
import * as Haptics from "expo-haptics";
import {ImpactFeedbackStyle} from "expo-haptics";
import {Settings} from "../../screens/signedIn/Settings";


const SignedInStack = createBottomTabNavigator();
const HistoryStack = createStackNavigator();
const AccountStack = createStackNavigator();
const AccountStackScreens = () => {
  return (
    <AccountStack.Navigator screenOptions={{
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
    }}>
      <AccountStack.Screen name="accountEntry" component={Account} options={{
        headerTitle: 'Account'
      }}/>
      <AccountStack.Screen name="plannedBudget" component={PlannedBudget} options={{
        headerTitle: 'Planned Budget'
      }}/>
      <AccountStack.Screen name="addCategory" component={AddCategory} options={{
        headerTitle: 'Add New Category'
      }}/>
      <AccountStack.Screen name="addIncome" component={EstimatedIncome} options={{
        headerTitle: 'Estimated Income'
      }}/>
      <AccountStack.Screen name="appSettings" component={Settings} options={{
        headerTitle: 'Display and Haptics'
      }}/>

    </AccountStack.Navigator>
  );
}
const HistoryTabScreens = () => {
  return (
    <HistoryStack.Navigator screenOptions={{
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
    }}>
      <HistoryStack.Screen name='historyEntry' component={History} options={{
        headerTitle: 'Transactions'
      }}/>
      {/*<HistoryStack.Screen name='historyEntryDetails' component={Details} />*/}
    </HistoryStack.Navigator>
  );
}
export const SignedInScreens = () => {
  const {colors} = useTheme();
  return (
    <SignedInStack.Navigator
      screenOptions={({route}) => ({
        headerShown: !['History', 'Account'].includes(route.name),
        headerTitleAlign: 'center',

        tabBarShowLabel: false,
        tabBarItemStyle: {
          alignSelf: 'center'
        },
        tabBarIcon: ({focused}) => {
          const Icon = {
            Home: () => <HomeIcon
              fill={focused ? colors.primary : colors.text}
              onTouchStart={async () => {
                await Haptics.impactAsync(ImpactFeedbackStyle.Medium);
              }}
            />,
            History: () => <HistoryIcon
              fill={focused ? colors.primary : colors.text}
              onTouchStart={async () => {
                await Haptics.impactAsync(ImpactFeedbackStyle.Medium);
              }}
            />,
            Add: () => <Plus
              fill={focused ? colors.primary : colors.text}
              onTouchStart={async () => {
                await Haptics.impactAsync(ImpactFeedbackStyle.Medium);
              }}
            />,
            Account: () => <AccountIcon
              fill={focused ? colors.primary : colors.text}
              onTouchStart={async () => {
                await Haptics.impactAsync(ImpactFeedbackStyle.Medium);
              }}
            />,
            Insights: () => <InsightIcon
              fill={focused ? colors.primary : colors.text}
              onTouchStart={async () => {
                await Haptics.impactAsync(ImpactFeedbackStyle.Medium);
              }}
            />
          };
          return Icon[route.name]();
        },
        tabBarStyle: {
          marginBottom: 24,
          marginHorizontal: 24,
          borderRadius: 32,
          paddingTop: 8,
          minHeight: 72,
          paddingBottom: 16,
          alignContent: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }
      })}
      initialRouteName="History"
    >
      <SignedInStack.Screen
        name="Home"
        component={Home}
      />
      <SignedInStack.Screen
        name="History"
        component={HistoryTabScreens}
      />

      <SignedInStack.Screen
        name="Add"
        component={Add}
      />

      <SignedInStack.Screen
        name="Insights"
        component={Insight}
      />
      <SignedInStack.Screen
        name="Account"
        component={AccountStackScreens}
      />
    </SignedInStack.Navigator>
  );
}