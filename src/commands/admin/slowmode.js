// Slowmode Command
// Sets slowmode for a channel

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
    .setName('slowmode')
    .setDescription('Set slowmode for a channel')
    .addIntegerOption(option =>
      option
        .setName('seconds')
        .setDescription('Slowmode duration in seconds (0 to disable)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600) // 6 hours max
    )
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to set slowmode for')
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const seconds = interaction.options.getInteger('seconds');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    // Check permissions
    if (!hasPermission(interaction.member, 'ManageChannels')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to manage channel slowmode.'),
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
      // Set slowmode
      await channel.setRateLimitPerUser(seconds);

      const statusText = seconds === 0 ? 'disabled' : `${seconds} second(s)`;

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.moderation)
        .setTitle('✓ Slowmode Updated')
        .addFields(
          { name: 'Channel', value: channel.toString(), inline: false },
          { name: 'Slowmode', value: statusText, inline: false },
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

      logger.success(`Slowmode set to ${statusText} in ${channel.name} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to set slowmode: ${error.message}`);
    }
  },
};
