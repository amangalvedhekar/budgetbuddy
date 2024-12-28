import {useEffect, useState} from "react";
import {hideAsync, preventAutoHideAsync} from "expo-splash-screen";
import {useDb} from "./useDb";
import {BudgetedData, Categories, TransactionTypes} from "../../schema";
import {isNotNull} from "drizzle-orm";
import {transactionTypes,categories} from "../utils/";

export const useCachedResources = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const {db} = useDb();
  useEffect(() => {
    (async () => {
      try {
        await preventAutoHideAsync();
        /*
        * setup custom fonts here and then release splash screen
        * */
        const transactionTypeLists = await db.select().from(TransactionTypes).where(isNotNull(TransactionTypes.transactionName));
        const categoryLists = await db.select().from(Categories).where(isNotNull(Categories.categoryName));
        if(Array.isArray(transactionTypeLists) && transactionTypeLists.length === 0) {
          await db.insert(TransactionTypes).values(transactionTypes);
        }
        if(Array.isArray(categoryLists) && categoryLists.length === 0) {
          await db.insert(Categories).values(categories);
        }
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