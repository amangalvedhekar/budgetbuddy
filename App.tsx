import {StatusBar} from "expo-status-bar";
import {AuthProvider} from "./src/contexts/";
import {useCachedResources} from "./src/hooks";
import {Amplify} from "aws-amplify";
import {Provider, useDispatch} from "react-redux";
import {RootNavigation} from "./src/navigation/stacks";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {store} from "./src/store";
import {StoreInitializer} from "./src/components/StoreInitializer";
import {ToastCard} from "./src/components/Toast/components/Card";
import React from "react";
import * as Sentry from '@sentry/react-native';
import {ThemeProvider} from "./src/components/ThemeProvider";


const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});
Sentry.init({
  // @ts-ignore
  dsn: `${process.env.EXPO_PUBLIC_SENTRY_DSN}`,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: true, // Tracks slow and frozen frames in the application
});
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
function App() {
  const {isLoadingComplete, scheme} = useCachedResources();

  if (!isLoadingComplete) {
    return <></>;
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <AuthProvider>
          <StoreInitializer>
          <ThemeProvider>
            <KeyboardProvider>
            <ToastCard/>


            <RootNavigation scheme={scheme}/>
            <StatusBar style="auto"/>


            </KeyboardProvider>
          </ThemeProvider>
          </StoreInitializer>
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
export default Sentry.wrap(App);
