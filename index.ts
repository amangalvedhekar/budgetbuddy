import 'react-native-gesture-handler';
import {registerRootComponent} from 'expo';
import App from './App';
import * as Sentry from '@sentry/react-native';
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});
Sentry.init({
  dsn: 'https://66d4ee67a96e96d9017068366c470dbe@o4507957202059264.ingest.us.sentry.io/4508038511067136',
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: true, // Tracks slow and frozen frames in the application
});

registerRootComponent(App);
