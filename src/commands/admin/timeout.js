// Timeout Command
// Times out a user (mutes them temporarily)

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  time,
} from 'discord.js';
import { hasPermission, botHasPermission, canInteract, botCanInteract } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user (mute temporarily)')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to timeout')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Timeout duration in minutes')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320) // Max Discord timeout is 40 days
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for timeout')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');
    const durationMinutes = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Check permissions
    if (!hasPermission(interaction.member, 'ModerateMembers')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to timeout members.'),
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
            .setDescription('I do not have permission to timeout members.'),
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
            .setTitle('❌ Cannot Timeout Self')
            .setDescription('You cannot timeout yourself.'),
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

    if (!canInteract(interaction.member, targetMember)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Timeout User')
            .setDescription(
              'You cannot timeout a user with an equal or higher role than you.'
            ),
        ],
        ephemeral: true,
      });
    }

    if (!botCanInteract(interaction.guild.members.me, targetMember)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Timeout User')
            .setDescription('I cannot timeout a user with an equal or higher role than me.'),
        ],
        ephemeral: true,
      });
    }

    try {
      // Timeout the user
      const timeoutDuration = durationMinutes * 60 * 1000; // Convert to milliseconds
      await targetMember.timeout(timeoutDuration, reason);

      const expiresAt = new Date(Date.now() + timeoutDuration);

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.moderation)
        .setTitle('✓ User Timed Out')
        .addFields(
          { name: 'User', value: `${targetUser.tag}`, inline: false },
          { name: 'Duration', value: `${durationMinutes} minutes`, inline: false },
          { name: 'Expires', value: time(expiresAt, 'F'), inline: false },
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

      logger.success(`User timed out: ${targetUser.tag} for ${durationMinutes} minutes by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to timeout user: ${error.message}`);
    }
  },
};
