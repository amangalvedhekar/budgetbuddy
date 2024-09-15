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
import {Categories, TransactionTypes} from "./schema";
import {isNotNull} from "drizzle-orm";
import {transactionTypes} from "./src/utils";
import {categories} from "./src/utils/categories";

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
  }
}
export default function App() {
  const expo = openDatabaseSync("mySQLiteDB.db");
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const db = drizzle(expo);
  useDrizzleStudio(expo);
  useMigrations(db, migrations);
  const scheme = useColorScheme();
  useEffect(() => {
    (async () => {
      try {
        await loadDb();
        const transactionTypeLists = await db.select().from(TransactionTypes).where(isNotNull(TransactionTypes.transactionName));
        const categoryLists = await db.select().from(Categories).where(isNotNull(Categories.categoryName));
        if(Array.isArray(transactionTypeLists) && transactionTypeLists.length === 0) {
          await db.insert(TransactionTypes).values(transactionTypes);
        }
        if(Array.isArray(categoryLists) && categoryLists.length === 0) {
          await db.insert(Categories).values(categories)
        }

        setIsDbLoaded(true);
      } catch (e) {

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
     <RootNavigation  scheme={scheme} />
      <StatusBar style="auto"/>
      </BottomSheetModalProvider>
    </TamaguiProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
