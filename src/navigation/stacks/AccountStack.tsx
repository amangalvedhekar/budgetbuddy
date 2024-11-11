import {createStackNavigator} from "@react-navigation/stack";
import {Account} from "../../screens";
import {AddCategory} from "../../screens/signedIn/AddCategory";

const AccountStack = createStackNavigator();

export const AccountStackScreens = () => {

  return (
    <AccountStack.Navigator screenOptions={{headerShown: false}}>
      <AccountStack.Screen name="account" component={Account} />
      <AccountStack.Screen name="addCategory" component={AddCategory} />
    </AccountStack.Navigator>
  );
}