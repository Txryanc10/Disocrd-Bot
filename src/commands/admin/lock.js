// Lock Command
// Locks a channel (removes send message permission from @everyone)

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { hasPermission, botHasPermission } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel (prevent members from sending messages)')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to lock')
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    // Check permissions
    if (!hasPermission(interaction.member, 'ManageChannels')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to lock channels.'),
        ],
        ephemeral: true,
      });
    }

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'ManageChannels')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to manage channels.'),
        ],
        ephemeral: true,
      });
    }

    try {
      // Get everyone role
      const everyoneRole = interaction.guild.roles.everyone;

      // Update permissions
      await channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: false,
      });

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.moderation)
        .setTitle('🔒 Channel Locked')
        .addFields(
          { name: 'Channel', value: channel.toString(), inline: false },
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

      logger.success(`Channel locked: ${channel.name} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to lock channel: ${error.message}`);
    }
  },
};
