import {NavigationContainer} from "@react-navigation/native";
import {useAuth} from "../../hooks";
import {SignedInScreens} from "./SignedInStack";
import {SignedOutScreens} from "./SignedOutStack";
import {DarkTheme, DefaultTheme} from "../theme";

export const RootNavigation = ({scheme}: any) => {
  const {ab} = useAuth();
  return (
    <>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme: DefaultTheme} >
        {ab != null ? <SignedInScreens />: <SignedOutScreens />}
      </NavigationContainer>
    </>
  );
}