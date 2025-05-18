import {NavigationContainer, useTheme} from "@react-navigation/native";
import {useAuth} from "../../hooks";
import {SignedInScreens} from "./SignedInStack";
import {SignedOutScreens} from "./SignedOutStack";
import {DarkTheme, DefaultTheme} from "../theme";
import {createStackNavigator} from "@react-navigation/stack";
import {Categories} from "../../screens/signedIn/Categories";
import {Text, XStack} from "tamagui";
import {Month} from "../../screens/signedIn/Month";
import {Details} from "../../screens/signedIn/Details";
import {Insight} from "../../screens";
import {ToastCard} from "../../components/Toast/components/Card";
import React from "react";
import {Filter} from "../../screens/signedIn/Filter";
import {Cross} from "../../icons";

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
          <DefaultStack.Screen name="Months" component={Month} options={({navigation}) => ({
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Select month to budget',
            headerLeft: () => <></>,
            headerRight: () => <Text style={{marginHorizontal: 16}} onPress={() => navigation.goBack()}>Done</Text>
          })}/>
          <DefaultStack.Screen name="historyEntryDetails" component={Details} options={({navigation}) => ({
            presentation: 'modal',
            headerShown: true,
            headerLeft: () => <></>,
            headerRight: () => <Text style={{marginHorizontal: 16}} onPress={() => navigation.goBack()}>Done</Text>
          })}/>

          <DefaultStack.Screen name="filter" component={Filter} options={({navigation}) => ({
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Filter for transactions',
            headerLeft: () => <></>,
            headerRight: () => <XStack marginHorizontal="$3">
              <Cross
                color="purple"
                height={32}
                width={32}
                onPress={() => navigation.goBack()}
              />
            </XStack>
          })}/>
        </DefaultStack.Navigator>
      </NavigationContainer>

    </>
  );
}