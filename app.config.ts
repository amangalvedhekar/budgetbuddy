import { ConfigContext, ExpoConfig } from "expo/config";

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  "plugins": [
    [
      "@sentry/react-native/expo",
      {
        // @ts-ignore
        "organization": `${process.env.EXPO_PUBLIC_SENTRY_ORG}`,
        // @ts-ignore
        "project": `${process.env.EXPO_PUBLIC_SENTRY_PROJECT}`,
        "url": "https://sentry.io/"
      }
    ],
    [
      "expo-splash-screen",
      {
        "backgroundColor": "#ffffff",
        "image": "./assets/adaptive-icon.png",
        "dark": {
          "image": "./assets/adaptive-icon.png",
          "backgroundColor": "#000000"
        },
        "resizeMode": "cover"
      }
    ],
    "expo-sqlite"
  ],
  "developmentClient": {
    "silentLaunch": true
  },
  "jsEngine": "hermes",
  "name": "BudgetGenie",
  "slug": "BudgetGenie",
  "version": "1.0.0",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "automatic",
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.anirudhm.budgetbuddy"
  },
  "android": {
    "package": "com.anirudhm.budgetbuddy"
  },
  "extra": {
    "eas": {
      "projectId": "32a54d4d-ec03-4f47-b8e3-bc72fb02dc00"
    }
  }
})