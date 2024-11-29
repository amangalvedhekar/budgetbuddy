import {openDatabaseSync} from "expo-sqlite";
import {drizzle} from "drizzle-orm/expo-sqlite/";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import {useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";

const useDb = () => {
  const expo = openDatabaseSync("mySQLiteDB.db");
  const db = drizzle(expo);
  useDrizzleStudio(expo);
  const mig = useMigrations(db, migrations);
console.log(mig, 'what is it')
  return {
    db,
  }
}

export {
  useDb,
}