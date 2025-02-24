import { Client, EmbedBuilder } from "discord.js";
import ms from "enhanced-ms";

import {
  deleteBossTimerById,
  getAllBossTimers,
  getBossTimerById,
} from "../database/queries.js";
import { bossTimerRow } from "./typings/types.js";

const timers: Record<string, NodeJS.Timeout> = {};

export const setBossTimer = (
  client: Client,
  bossName: string,
  rowId: number,
  timeInMs: number,
  replaceOld?: boolean,
  row?: bossTimerRow
) => {
  if (replaceOld && row) {
    const oldTimer = timers[bossName];

    const timeDifference = Date.now() - row.createdAt;

    timeInMs -= timeDifference;

    if (oldTimer) clearTimeout(oldTimer);
  }

  const timer = setTimeout(async () => {
    try {
      console.log("running timer");
      const bossTimer = getBossTimerById.get(rowId) as bossTimerRow;

      if (!bossTimer.bossName)
        return console.log(
          `Could not find row for ${bossName} when timer finished`
        );

      const channel = client.channels.cache.get(bossTimer.channelId);

      if (!channel)
        return console.log(
          `Channel not found for ${bossName} when time finished`
        );

      if (!channel.isSendable()) return;

      await channel.send(
        `@everyone timer finished for boss **${bossTimer.bossName}**!`
      );

      deleteBossTimerById.run(bossTimer.rowid);
    } catch (error) {
      console.log(error);
    }
  }, timeInMs);

  timers[bossName] = timer;
};

export const generateCurrentTimerEmbed = async () => {
  const timers = getAllBossTimers.all() as Array<bossTimerRow>;

  if (timers.length === 0) throw new Error("No timer is running yet!");

  let str = "";

  timers.forEach(
    (t) =>
      (str += `${t.bossName} <#${t.channelId}> <t:${Math.floor(
        (t.createdAt + t.deadTimestamp) / 1000
      )}:R>\n\n`)
  );
  return new EmbedBuilder().setDescription(str);
};
