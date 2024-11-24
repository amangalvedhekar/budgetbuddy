import {NavigationContainer} from "@react-navigation/native";
import {useAuth} from "../../hooks";
import {SignedInScreens} from "./SignedInStack";
import {SignedOutScreens} from "./SignedOutStack";
import {DarkTheme, DefaultTheme} from "../theme";
import {createStackNavigator} from "@react-navigation/stack";
import {Categories} from "../../screens/signedIn/Categories";
import {Text} from "tamagui";

const DefaultStack = createStackNavigator();
export const RootNavigation = ({scheme}: any) => {
  const {ab} = useAuth();
  return (
    <>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <DefaultStack.Navigator screenOptions={{headerShown: false}}>
          {
            ab != null ? <DefaultStack.Screen name="signedIn" component={SignedInScreens}/> :
              <DefaultStack.Screen name="signedout" component={SignedOutScreens}/>
          }
          <DefaultStack.Screen name="Categories" component={Categories} options={({navigation}) => ({
            presentation: 'modal',
            headerShown: true,
            headerLeft: () => <></>,
            headerRight: () => <Text style={{marginHorizontal: 16}} onPress={() => navigation.goBack()}>Done</Text>
          })}/>
        </DefaultStack.Navigator>
      </NavigationContainer>
    </>
  );
}