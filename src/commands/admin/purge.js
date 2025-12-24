// Purge Command
// Bulk delete messages from a channel

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, botHasPermission } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages from channel')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Number of messages to delete')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');

    // Check permissions
    if (!hasPermission(interaction.member, 'ManageMessages')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to purge messages.'),
        ],
        ephemeral: true,
      });
    }

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'ManageMessages')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to manage messages.'),
        ],
        ephemeral: true,
      });
    }

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.moderation)
        .setTitle('✓ Messages Purged')
        .addFields(
          { name: 'Channel', value: interaction.channel.toString(), inline: false },
          { name: 'Messages Deleted', value: `${deleted.size}`, inline: false },
          { name: 'Moderator', value: interaction.user.tag, inline: false }
        )
        .setTimestamp();

      // Defer or reply
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ embeds: [successEmbed] });

      // Log to mod log channel if configured
      if (config.modLogChannel) {
        const logChannel = await interaction.guild.channels.fetch(config.modLogChannel).catch(() => null);
        if (logChannel) {
          await logChannel.send({ embeds: [successEmbed] });
        }
      }

      logger.success(`${deleted.size} messages purged from ${interaction.channel.name} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to purge messages: ${error.message}`);
    }
  },
};
