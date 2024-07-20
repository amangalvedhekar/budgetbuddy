import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {useAuth} from "../../hooks";
import {SignedInScreens} from "./SignedInStack";
import {SignedOutScreens} from "./SignedOutStack";

export const RootNavigation = ({scheme}) => {
  const {ab} = useAuth();
  return (
    <>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme: DefaultTheme}>
        {ab != null ? <SignedInScreens />: <SignedOutScreens />}
      </NavigationContainer>
    </>
  );
}