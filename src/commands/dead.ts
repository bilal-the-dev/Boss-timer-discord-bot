import { bossTimerRow } from "./../utils/typings/types.js";
import { ApplicationCommandOptionType } from "discord.js";
import { ms } from "enhanced-ms";

import { bossRow, extendedAPICommand } from "../utils/typings/types.js";
import {
  createBossTimer,
  deleteBossTimerById,
  getAllBosses,
  getBossByName,
  getBossTimerBossName,
  updateBossTimerById,
} from "../database/queries.js";
import {
  generateCurrentTimerEmbed,
  removeOldTimerIfExists,
  setBossTimer,
} from "../utils/timer.js";

export default {
  name: "dead",
  description: "Starts timer for a boss!",
  options: [
    {
      name: "boss_name",
      description: "the name of the boss",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "time",
      description:
        "[OPTIONAL] enter the time in format (5 mins, 5h 5mins, 1d, 3weeks etc)",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "seconds",
      description: "[OPTIONAL] enter the seconds in format (10, 40, 50)",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  autocomplete: async (interaction) => {
    const bosses = getAllBosses.all() as bossRow[];

    return bosses
      .filter((b) =>
        b.bossName
          .toLowerCase()
          .startsWith(interaction.options.getFocused().toLowerCase())
      )
      .map((b) => b.bossName);
  },
  execute: async (interaction) => {
    const { options, channelId, client } = interaction;

    await interaction.deferReply();

    const bossName = options.getString("boss_name", true);
    const time = options.getString("time");
    let secondsForBossDead = options.getInteger("seconds"); // no effect on functionality of bot just dummy

    const bossExists = getBossByName.get(bossName) as bossRow;

    if (!bossExists) throw new Error("Boss with that name does not exists");

    let timeInMs = bossExists.deadTimestamp;
    let shouldPlus = true;

    if (time?.startsWith("-")) shouldPlus = false;

    const bossTimerExists = getBossTimerBossName.get(bossName) as bossTimerRow;
    let shouldResetAndStartNew = false;

    if (time) {
      timeInMs = ms(time);

      if (timeInMs === 0)
        throw new Error(
          "Please enter correct format for time like 5 min, 5 hrs, 1 day!"
        );
    }

    if (bossTimerExists) {
      secondsForBossDead ??= bossTimerExists.seconds; // if user did not put time so we just put old when creating/updating
      if (!time) {
        deleteBossTimerById.run(bossTimerExists.rowid);
        removeOldTimerIfExists(bossName);
        shouldResetAndStartNew = true;
      }

      if (time) {
        const updatedTime = shouldPlus
          ? bossTimerExists.deadTimestamp + timeInMs
          : bossTimerExists.deadTimestamp - timeInMs;

        updateBossTimerById.run(
          updatedTime,
          time,
          Date.now(),
          secondsForBossDead,
          bossTimerExists.rowid
        );

        console.log(updatedTime);

        setBossTimer(
          client,
          bossName,
          bossTimerExists.rowid,
          updatedTime,
          true,
          bossTimerExists
        );
      }
    }

    if (!bossTimerExists || shouldResetAndStartNew) {
      if (time) {
        console.log(`IN FIRST TIME: ${timeInMs}`);
        shouldPlus
          ? (timeInMs += bossExists.deadTimestamp)
          : (timeInMs = bossExists.deadTimestamp - timeInMs);
      }
      const d = createBossTimer.get(
        bossName,
        channelId,
        timeInMs,
        time,
        secondsForBossDead,
        Date.now()
      ) as bossTimerRow;

      setBossTimer(client, bossName, d.rowid, timeInMs);
    }

    const embed = await generateCurrentTimerEmbed();

    await interaction.editReply({
      content: `Success, will notify when time finished, you can view current timers via /view`,
      embeds: [embed],
    });
  },
} satisfies extendedAPICommand;
