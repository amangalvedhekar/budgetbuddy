import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParams} from "../types";
import {Registration} from "../../screens/signedout/Registration";
import {ConfirmationCode} from "../../screens/signedout/ConfirmationCode";
import {SignIn} from "../../screens/signedout/SignIn";

const SignedOutStack = createStackNavigator<RootStackParams>();

/*
* screenOptions={{headerTitle: '', headerLeftLabelVisible: false, cardStyle: {backgroundColor: 'black'}, headerTitleStyle: {color: 'white'}, headerStyle: {backgroundColor: 'black'}}}
* */

export const SignedOutScreens = () => {
  return (
    <SignedOutStack.Navigator screenOptions={{headerLeftLabelVisible: false}}>
      <SignedOutStack.Screen name="Register" component={Registration} options={{headerTitle:'Registration'}} />
      <SignedOutStack.Screen name="SignIn" component={SignIn} options={{headerTitle:'Sign In'}}/>
      {/*<SignedOutStack.Screen name="ForgotPassword" component={TestScreen} />*/}
      <SignedOutStack.Screen name="Code" component={ConfirmationCode} options={{headerTitle:'Confirm Account'}}/>
      {/*<SignedOutStack.Screen name="Welcome" component={TestScreen} options={{headerTitle:'Welcome user'}}/>*/}
    </SignedOutStack.Navigator>
  );
}
