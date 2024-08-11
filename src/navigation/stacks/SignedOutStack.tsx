import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParams} from "../types";
import {
  Registration,
  ConfirmationCode,
  ForgotPassword,
  SignIn
} from "../../screens";

const SignedOutStack = createStackNavigator<RootStackParams>();


export const SignedOutScreens = () => {
  return (
    <SignedOutStack.Navigator screenOptions={{headerLeftLabelVisible: false}}>

      <SignedOutStack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerTitle: 'Sign In'}}
      />

      <SignedOutStack.Screen
        name="Register"
        component={Registration}
        options={{headerTitle: 'Registration'}}
      />

      <SignedOutStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerTitle: 'Reset Password'}}
      />

      <SignedOutStack.Screen
        name="Code"
        component={ConfirmationCode}
        options={{headerTitle: 'Confirm Account'}}
        initialParams={{username: ''}}
      />
    </SignedOutStack.Navigator>
  );
}
