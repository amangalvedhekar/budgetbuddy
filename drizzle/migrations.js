// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_happy_raza.sql';
import m0001 from './0001_sharp_sinister_six.sql';
import m0002 from './0002_late_red_skull.sql';
import m0003 from './0003_faulty_redwing.sql';
import m0004 from './0004_tiny_quicksilver.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  