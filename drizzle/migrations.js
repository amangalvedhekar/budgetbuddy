// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_true_lake.sql';
import m0001 from './0001_dizzy_alex_power.sql';
import m0002 from './0002_secret_robbie_robertson.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002
    }
  }
  