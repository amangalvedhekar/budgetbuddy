import {useEffect, useState} from "react";
import {hideAsync, preventAutoHideAsync} from "expo-splash-screen";
import {Asset} from "expo-asset";
import {documentDirectory, downloadAsync, getInfoAsync, makeDirectoryAsync} from "expo-file-system";


export const useCachedResources = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        await preventAutoHideAsync();
        const dbName = "mySQLiteDB.db";
        const dbAsset = require("../../assets/budgetBuddy.db");
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
        /*
        * setup custom fonts here and then release splash screen
        * */
        await hideAsync();
      } catch (e) {
console.error(e);
      } finally {
        setIsLoadingComplete(true);
      }
    })();
  }, []);

  return isLoadingComplete;
}