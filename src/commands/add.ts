import { ApplicationCommandOptionType } from "discord.js";
import { ms } from "enhanced-ms";

import { bossRow, extendedAPICommand } from "../utils/typings/types.js";
import {
  createBoss,
  getBossByName,
  updateBossById,
} from "../database/queries.js";

export default {
  name: "add",
  description: "Add a boss!",
  options: [
    {
      name: "boss_name",
      description: "the name of the boss",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "time",
      description:
        "Enter the time in format (5 mins, 5h 5mins, 1d, 3weeks etc)",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (interaction) => {
    const { options } = interaction;

    await interaction.deferReply();

    const bossName = options.getString("boss_name", true);
    const time = options.getString("time", true);

    const boss = getBossByName.get(bossName) as bossRow;

    let timeInMs = ms(time);

    console.log(timeInMs);

    if (timeInMs === 0)
      throw new Error(
        "Please enter correct format for time like 5 min, 5 hrs, 1 day!"
      );

    if (boss.bossName) updateBossById.run(timeInMs, boss.rowid);
    if (!boss.bossName) createBoss.run(bossName, timeInMs, Date.now());

    await interaction.editReply("Success, saved the boss!");
  },
} satisfies extendedAPICommand;
