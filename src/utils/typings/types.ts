import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  PermissionFlags,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export interface extendedAPICommand
  extends RESTPostAPIChatInputApplicationCommandsJSONBody {
  permissionRequired?: PermissionFlags | Array<PermissionFlags>;
  guildOnly?: Boolean;
  autocomplete?(
    interaction: AutocompleteInteraction
  ): Promise<Array<ApplicationCommandOptionChoiceData | string>>;
  execute(interaction: ChatInputCommandInteraction): Promise<any>;
}

export interface bossRow {
  rowid: number;
  bossName: string;
  deadTimestamp: number;
  createdAt: number;
}

export interface bossTimerRow extends bossRow {
  channelId: string;
  deadTimestamp: number;
  updatedAt?: number;
}
