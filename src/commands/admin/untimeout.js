// Untimeout Command
// Removes timeout from a user

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, botHasPermission, canInteract, botCanInteract } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove timeout from a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to remove timeout from')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for removing timeout')
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
            .setDescription('You do not have permission to remove timeouts.'),
        ],
        ephemeral: true,
      });
    }

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'ModerateMembers')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to remove timeouts.'),
        ],
        ephemeral: true,
      });
    }

    // Get target member
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ User Not Found')
            .setDescription('The user is not in this server.'),
        ],
        ephemeral: true,
      });
    }

    if (!targetMember.isCommunicationDisabled()) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ User Not Timed Out')
            .setDescription('This user is not currently timed out.'),
        ],
        ephemeral: true,
      });
    }

    if (!canInteract(interaction.member, targetMember)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Remove Timeout')
            .setDescription(
              'You cannot remove timeout from a user with an equal or higher role than you.'
            ),
        ],
        ephemeral: true,
      });
    }

    try {
      // Remove timeout
      await targetMember.timeout(null, reason);

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Timeout Removed')
        .addFields(
          { name: 'User', value: `${targetUser.tag}`, inline: false },
          { name: 'Reason', value: reason, inline: false },
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

      logger.success(`Timeout removed: ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to remove timeout: ${error.message}`);
    }
  },
};
