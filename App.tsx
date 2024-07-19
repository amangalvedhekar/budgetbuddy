import {TamaguiProvider} from "tamagui";
import {config} from "./tamagui.config";
import {useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {AuthProvider} from "./src/contexts/";
import {useCachedResources} from "./src/hooks/useCachedResources";
import {Amplify} from "aws-amplify";
import {RootNavigation} from "./src/navigation/stacks";
Amplify.configure({
  Auth: {
    Cognito: {
// @ts-ignore
      userPoolId: `${process.env.EXPO_PUBLIC_USER_POOL_ID}`,
      // @ts-ignore
      userPoolClientId: `${process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID}`,


    },

  }
})
export default function App() {

  const scheme = useColorScheme();
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return <></>;
  }
  return (
    <AuthProvider>
    <TamaguiProvider config={config} defaultTheme={scheme!}>
     <RootNavigation  scheme={scheme} />
      <StatusBar style="auto"/>
    </TamaguiProvider>
    </AuthProvider>
  );
}
