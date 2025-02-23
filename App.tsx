import {TamaguiProvider} from "tamagui";
import {config} from "./tamagui.config";
import {useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";
import {AuthProvider} from "./src/contexts/";
import {useCachedResources} from "./src/hooks";
import {Amplify} from "aws-amplify";
import {Provider} from "react-redux";
import {RootNavigation} from "./src/navigation/stacks";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {store} from "./src/store";
import {Toast} from "./src/contexts/Toast/Toast";
import {StoreInitializer} from "./src/components/StoreInitializer";

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
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
      <KeyboardProvider>
        <AuthProvider>
          <TamaguiProvider config={config} defaultTheme={scheme!}>
            <StoreInitializer>
            <RootNavigation scheme={scheme}/>
            <StatusBar style="auto"/>
            </StoreInitializer>
          </TamaguiProvider>
        </AuthProvider>
      </KeyboardProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
