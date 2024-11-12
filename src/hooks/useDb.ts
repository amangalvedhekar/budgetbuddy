import {openDatabaseSync} from "expo-sqlite/next";
import {drizzle} from "drizzle-orm/expo-sqlite/";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import {useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";

const useDb = () => {
  const expo = openDatabaseSync("mySQLiteDB.db");
  const db = drizzle(expo);
  useDrizzleStudio(expo);
  useMigrations(db, migrations);

  return {
    db,
  }
}

export {
  useDb,
}