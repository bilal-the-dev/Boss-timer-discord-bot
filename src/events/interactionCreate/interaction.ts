import { BaseInteraction } from "discord.js";

import { handleInteractionError } from "../../utils/interaction.js";

export default async (interaction: BaseInteraction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.find(
        (c) => c.name === interaction.commandName
      );

      if (!command?.execute) throw new Error("Command is not setup yet!");

      await command.execute(interaction);
    }

    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.find(
        (c) => c.name === interaction.commandName
      );

      if (!command?.autocomplete) return;

      let response = await command.autocomplete(interaction);

      response = response.slice(0, 25);

      await interaction.respond(
        response.map((r) => (typeof r === "string" ? { name: r, value: r } : r))
      );
    }
  } catch (error) {
    if (error instanceof Error) handleInteractionError(interaction, error);
  }
};
