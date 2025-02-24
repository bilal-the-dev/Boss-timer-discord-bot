import database from "./database.js";

export const getAllBosses = database.prepare(`SELECT * FROM bosses`);

export const createBoss = database.prepare(`
  INSERT INTO bosses (bossName, deadTimestamp, createdAt)
  VALUES (?, ?, ?)
`);

export const getBossByName = database.prepare(`
  SELECT ROWID,* FROM bosses WHERE bossName = ?
`);

export const updateBossById = database.prepare(`
UPDATE bosses
SET deadTimestamp = ?
WHERE ROWID = ?;
`);

export const createBossTimer = database.prepare(
  `INSERT INTO bossTimers (bossName, channelId, deadTimestamp, prevDeadTimestamp, createdAt) VALUES (?, ?, ? , ?, ?)
  RETURNING ROWID`
);

export const getAllBossTimers = database.prepare(`
  SELECT ROWID,* FROM bossTimers ORDER BY deadTimestamp DESC
`);

export const getBossTimerBossName = database.prepare(`
  SELECT ROWID,* FROM bossTimers WHERE bossName = ?
`);

export const getBossTimerById = database.prepare(`
  SELECT ROWID,* FROM bossTimers WHERE ROWID = ?
`);

export const updateBossTimerById = database.prepare(`
UPDATE bossTimers
SET deadTimestamp = ?, prevDeadTimestamp = ? , updatedAt = ?
WHERE ROWID = ?;
`);

export const deleteBossTimerById = database.prepare(`
  DELETE FROM bossTimers WHERE ROWID = ?;
`);
