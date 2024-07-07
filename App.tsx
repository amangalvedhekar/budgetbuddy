import {TamaguiProvider} from "tamagui";
import {config} from "./tamagui.config";
import {useColorScheme} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {SignedOutScreens} from "./src/navigation/stacks/SignedOutStack";
import {StatusBar} from "expo-status-bar";

export default function App() {
  const scheme = useColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme={scheme!}>
      <NavigationContainer>
        <SignedOutScreens/>
      </NavigationContainer>
      <StatusBar style="auto"/>
    </TamaguiProvider>
  );
}