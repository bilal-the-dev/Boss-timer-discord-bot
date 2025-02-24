import { extendedAPICommand } from "../utils/typings/types.js";
import { generateCurrentTimerEmbed } from "../utils/timer.js";

export default {
  name: "view",
  description: "View all bosses and their running timers",

  execute: async (interaction) => {
    await interaction.deferReply();

    const embed = await generateCurrentTimerEmbed();

    await interaction.editReply({
      embeds: [embed],
    });
  },
} satisfies extendedAPICommand;
