import { Client } from "discord.js";

import registerAndAttachCommandsOnClient from "../../utils/registrars/registerCommands.js";
import { getAllBossTimers } from "../../database/queries.js";
import { bossTimerRow } from "../../utils/typings/types.js";
import { setBossTimer } from "../../utils/timer.js";

export default async (client: Client<true>) => {
  console.log(`${client.user.username} (${client.user.id}) is ready 🐬`);
  await registerAndAttachCommandsOnClient(client);

  const bossTimerRows = getAllBossTimers.all() as Array<bossTimerRow>;

  for (const row of bossTimerRows) {
    setBossTimer(client, row.bossName, row.rowid, row.deadTimestamp, true, row);
  }
};
