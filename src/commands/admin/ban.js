// Ban Command
// Bans a user from the guild with optional reason and duration

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
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for banning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Check permissions
    if (!hasPermission(interaction.member, 'BanMembers')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to ban members.'),
        ],
        ephemeral: true,
      });
    }

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'BanMembers')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to ban members.'),
        ],
        ephemeral: true,
      });
    }

    // Check if target is bot owner or same as executor
    if (targetUser.id === interaction.user.id) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Ban Self')
            .setDescription('You cannot ban yourself.'),
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
            .setTitle('❌ Cannot Ban User')
            .setDescription(
              'You cannot ban a user with an equal or higher role than you.'
            ),
        ],
        ephemeral: true,
      });
    }

    if (targetMember && !botCanInteract(interaction.guild.members.me, targetMember)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Ban User')
            .setDescription('I cannot ban a user with an equal or higher role than me.'),
        ],
        ephemeral: true,
      });
    }

    try {
      // Ban the user
      await interaction.guild.members.ban(targetUser, { reason: reason });

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.moderation)
        .setTitle('✓ User Banned')
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

      logger.success(`User banned: ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to ban user: ${error.message}`);
    }
  },
};
