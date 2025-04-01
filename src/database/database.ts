import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const database = new DatabaseSync(
  path.join(import.meta.dirname, "..", "..", "main.db")
);

const initDatabase = `
create table IF NOT EXISTS bosses (
  bossName TEXT NOT NULL UNIQUE,
  deadTimestamp INTEGER,
  createdAt INTEGER NOT NULL
);

create table IF NOT EXISTS bossTimers (
  bossName TEXT NOT NULL,
  channelId TEXT NOT NULL,
  deadTimestamp INTEGER NOT NULL,
  prevDeadTimestamp TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER
);
`;

const addSecondsColumnQuery = `ALTER TABLE bossTimers ADD seconds INTEGER`;

database.exec(initDatabase);

// database.exec(addSecondsColumnQuery);

export default database;
