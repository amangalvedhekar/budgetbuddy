import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import {Card, Paragraph, TamaguiProvider, XStack, YStack} from "tamagui";
import {config} from "./tamagui.config";
import {useEffect} from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";


export default function App() {
  return (
    <SafeAreaProvider>
    <TamaguiProvider config={config} defaultTheme={'dark'}>
      <Card elevate padded flex={1}>
        <Card.Header>
          <Paragraph>
            header for card
          </Paragraph>
        </Card.Header>
      </Card>
      <StatusBar style="dark" />
    </TamaguiProvider>
    </SafeAreaProvider>
  );
}