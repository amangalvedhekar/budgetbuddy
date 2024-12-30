import {openDatabaseSync} from "expo-sqlite";
import {drizzle} from "drizzle-orm/expo-sqlite/";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import {useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
// import {BudgetedData, Categories, UserLists, TransactionLists, TransactionTypes} from '../../schema';
import * as schema from '../../schema';
const useDb = () => {
  const expo = openDatabaseSync("mySQLiteDB.db");
  const db = drizzle(expo, {schema});
  useDrizzleStudio(expo);
  useMigrations(db, migrations);
  return {
    db,
  }
}

export {
  useDb,
}