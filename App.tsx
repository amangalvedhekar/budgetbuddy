import {TamaguiProvider} from "tamagui";
import {config} from "./tamagui.config";
import {useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";
import {AuthProvider} from "./src/contexts/";
import {useCachedResources} from "./src/hooks";
import {Amplify} from "aws-amplify";
import {RootNavigation} from "./src/navigation/stacks";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";

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
    <GestureHandlerRootView style={{flex:1}}>
    <AuthProvider>
    <TamaguiProvider config={config} defaultTheme={scheme!}>
      <BottomSheetModalProvider>
     <RootNavigation  scheme={scheme} />
      <StatusBar style="auto"/>
      </BottomSheetModalProvider>
    </TamaguiProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
