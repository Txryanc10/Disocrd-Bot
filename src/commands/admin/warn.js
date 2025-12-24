// Warn Command
// Warn a user (adds warning to their record)

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, botHasPermission, canInteract } from '../../utils/permissions.js';
import { addWarning } from '../../utils/warningManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for warning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Check permissions
    if (!hasPermission(interaction.member, 'ModerateMembers')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to warn members.'),
        ],
        ephemeral: true,
      });
    }

    // Check if target is same as executor
    if (targetUser.id === interaction.user.id) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Warn Self')
            .setDescription('You cannot warn yourself.'),
        ],
        ephemeral: true,
      });
    }

    // Get target member
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (targetMember && !canInteract(interaction.member, targetMember)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Warn User')
            .setDescription(
              'You cannot warn a user with an equal or higher role than you.'
            ),
        ],
        ephemeral: true,
      });
    }

    try {
      // Add warning
      const warningCount = addWarning(targetUser.id, interaction.guildId, {
        reason,
        moderator: interaction.user.tag,
      });

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.moderation)
        .setTitle('⚠️ User Warned')
        .addFields(
          { name: 'User', value: targetUser.tag, inline: false },
          { name: 'Reason', value: reason, inline: false },
          { name: 'Total Warnings', value: `${warningCount}`, inline: false },
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

      logger.success(`User warned: ${targetUser.tag} (${warningCount} warnings) by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to warn user: ${error.message}`);
    }
  },
};
