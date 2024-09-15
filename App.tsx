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
import {openDatabaseSync} from "expo-sqlite/next";
import {drizzle} from "drizzle-orm/expo-sqlite/";
import {useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import {documentDirectory, downloadAsync, getInfoAsync, makeDirectoryAsync} from "expo-file-system";
import {Asset} from "expo-asset";
import {useEffect, useState} from "react";
import migrations from './drizzle/migrations';
import {SQLiteProvider} from "expo-sqlite/next";

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
const loadDb = async () => {
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("./assets/budgetBuddy.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${documentDirectory}SQLite/${dbName}`;

  const fileInfo = await getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await makeDirectoryAsync(
      `${documentDirectory}SQLite`,
      { intermediates: true }
    );
    await downloadAsync(dbUri, dbFilePath);
    // migrate(dbUri)
  }
}
export default function App() {
  const expo = openDatabaseSync("mySQLiteDB.db");
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const db = drizzle(expo);
  useDrizzleStudio(expo);
  const x = useMigrations(db, migrations);
  const scheme = useColorScheme();
  useEffect(() => {
    (async () => {
      try {
        await loadDb();
        setIsDbLoaded(true);
      } catch (e) {
        console.log(e, 'hmmmmmm')
      }

    })();
  },[])
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete || !isDbLoaded) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{flex:1}}>
    <AuthProvider>
    <TamaguiProvider config={config} defaultTheme={scheme!}>
      <BottomSheetModalProvider>
        <SQLiteProvider databaseName="mySQLiteDB.db" >
     <RootNavigation  scheme={scheme} />
        </SQLiteProvider>
      <StatusBar style="auto"/>
      </BottomSheetModalProvider>
    </TamaguiProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
