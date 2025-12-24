// Clearwarnings Command
// Clear all warnings for a user

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission } from '../../utils/permissions.js';
import { clearUserWarnings } from '../../utils/warningManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear all warnings for a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to clear warnings for')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');

    // Check permissions
    if (!hasPermission(interaction.member, 'ModerateMembers')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to clear warnings.'),
        ],
        ephemeral: true,
      });
    }

    try {
      clearUserWarnings(targetUser.id, interaction.guildId);

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Warnings Cleared')
        .addFields(
          { name: 'User', value: targetUser.tag, inline: false },
          { name: 'Moderator', value: interaction.user.tag, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

      // Log to mod log channel if configured
      if (config.modLogChannel) {
        const logChannel = await interaction.guild.channels.fetch(config.modLogChannel).catch(() => null);
        if (logChannel) {
          await logChannel.send({ embeds: [successEmbed] });
        }
      }

      logger.success(`Warnings cleared for ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to clear warnings: ${error.message}`);
    }
  },
};
