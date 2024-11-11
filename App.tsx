import {TamaguiProvider} from "tamagui";
import {config} from "./tamagui.config";
import {useColorScheme, Text} from "react-native";
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
import {useDb} from "./src/hooks/useDb";

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
  // const {db} = useDb();
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const transactionTypeLists = await db.select().from(TransactionTypes).where(isNotNull(TransactionTypes.transactionName));
  //       const categoryLists = await db.select().from(Categories).where(isNotNull(Categories.categoryName));
  //       if(Array.isArray(transactionTypeLists) && transactionTypeLists.length === 0) {
  //         await db.insert(TransactionTypes).values(transactionTypes);
  //       }
  //       if(Array.isArray(categoryLists) && categoryLists.length === 0) {
  //         await db.insert(Categories).values(categories)
  //       }
  //     } catch (e) {
  //
  //     }
  //
  //   })();
  // },[])
  // const isLoadingComplete = useCachedResources();
  // if (!isLoadingComplete) {
  //   return <></>;
  // }

  return (
    <GestureHandlerRootView style={{flex:1}}>
    {/*<AuthProvider>*/}
    {/*<TamaguiProvider config={config} defaultTheme={scheme!}>*/}
    {/*  <BottomSheetModalProvider>*/}
    {/* <RootNavigation  scheme={scheme} />*/}
    {/*  <StatusBar style="auto"/>*/}
    {/*  </BottomSheetModalProvider>*/}
    {/*</TamaguiProvider>*/}
    {/*</AuthProvider>*/}
      <Text>aloha</Text>
    </GestureHandlerRootView>
  );
}
