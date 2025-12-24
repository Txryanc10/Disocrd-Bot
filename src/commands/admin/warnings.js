// Warnings Command
// View warnings for a user

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission } from '../../utils/permissions.js';
import { getUserWarnings } from '../../utils/warningManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to check warnings for')
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
            .setDescription('You do not have permission to view warnings.'),
        ],
        ephemeral: true,
      });
    }

    try {
      const warnings = getUserWarnings(targetUser.id, interaction.guildId);

      if (warnings.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.success)
              .setTitle('✓ User Has No Warnings')
              .setDescription(`${targetUser.tag} has no warnings.`)
              .setTimestamp(),
          ],
        });
      }

      const warningEmbed = new EmbedBuilder()
        .setColor(config.colors.moderation)
        .setTitle(`⚠️ Warnings for ${targetUser.tag}`)
        .setDescription(`Total warnings: **${warnings.length}**`)
        .setTimestamp();

      warnings.forEach((warning, index) => {
        const timestamp = new Date(warning.timestamp).toLocaleDateString();
        warningEmbed.addFields({
          name: `Warning #${index + 1}`,
          value: `**Reason:** ${warning.reason}\n**Moderator:** ${warning.moderator}\n**Date:** ${timestamp}`,
          inline: false,
        });
      });

      await interaction.reply({ embeds: [warningEmbed] });

      logger.success(`Warnings viewed for ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to view warnings: ${error.message}`);
    }
  },
};
