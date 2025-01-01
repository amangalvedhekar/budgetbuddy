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
import {createStackNavigator} from "@react-navigation/stack";
import {Details} from "../../screens/signedIn/Details";
import {AddCategory} from "../../screens/signedIn/AddCategory";
import {PlannedBudget} from "../../screens/signedIn/PlannedBudget";

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
      }} />
      <AccountStack.Screen name="plannedBudget" component={PlannedBudget} options={{
        headerTitle: 'Planned Budget'
      }} />
      <AccountStack.Screen name="addCategory" component={AddCategory} options={{
        headerTitle: 'Add New Category'
      }} />
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
      screenOptions={({route}) =>({
        headerShown:  !['History', 'Account'].includes(route.name),
        headerTitleAlign: 'center'
      })}
      initialRouteName="History"
    >
      {/*<SignedInStack.Screen*/}
      {/*  name="Home"*/}
      {/*  component={Home}*/}
      {/*  options={{*/}
      {/*    tabBarLabelStyle: {fontWeight: '600', fontSize: 16},*/}
      {/*    tabBarIcon: ({focused}) => <HomeIcon fill={focused ? colors.primary : colors.text}/>,*/}
      {/*  }}*/}
      {/*/>*/}
      <SignedInStack.Screen
        name="History"
        component={HistoryTabScreens}
        options={
          {
            tabBarLabelStyle: {
              fontWeight: '600',
              fontSize: 16,
            },
            tabBarIcon: ({focused}) => <HistoryIcon fill={focused ? colors.primary : colors.text}/>,
            tabBarLabel: 'Home'
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
        component={AccountStackScreens}
        options={{
          tabBarLabelStyle: {fontWeight: '600', fontSize: 16},
          tabBarIcon: ({focused}) => <AccountIcon fill={focused ? colors.primary : colors.text}/>,
        }}
      />
    </SignedInStack.Navigator>
  );
}