// Say Command
// Echo a message

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { botHasPermission } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Echo a message')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Message to echo')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const message = interaction.options.getString('message');

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'SendMessages')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to send messages.'),
        ],
        ephemeral: true,
      });
    }

    try {
      await interaction.channel.send(message);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription('✓ Message sent!'),
        ],
        ephemeral: true,
      });

      logger.success(`Message echoed by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  },
};
