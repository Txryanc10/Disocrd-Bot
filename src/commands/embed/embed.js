// Embed Command
// Create and send custom embeds

import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import { hasPermission, botHasPermission } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create and send custom embeds')
    .addSubcommand(sub =>
      sub
        .setName('create')
        .setDescription('Create a custom embed')
        .addStringOption(option =>
          option
            .setName('title')
            .setDescription('Embed title')
            .setRequired(false)
        )
        .addStringOption(option =>
          option
            .setName('description')
            .setDescription('Embed description')
            .setRequired(false)
        )
        .addStringOption(option =>
          option
            .setName('color')
            .setDescription('Embed color (hex format: #FF0000)')
            .setRequired(false)
        )
    ),

  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      const title = interaction.options.getString('title') || 'Embed';
      const description = interaction.options.getString('description') || 'No description';
      const color = interaction.options.getString('color') || config.colors.info;

      try {
        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setColor(parseInt(color.replace('#', ''), 16) || config.colors.info)
          .setFooter({ text: `Created by ${interaction.user.tag}` })
          .setTimestamp();

        const confirmEmbed = new EmbedBuilder()
          .setColor(config.colors.success)
          .setTitle('✓ Embed Created')
          .setDescription('Your embed has been sent to this channel.')
          .setTimestamp();

        await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        await interaction.channel.send({ embeds: [embed] });

        logger.success(`Embed created by ${interaction.user.tag}`);
      } catch (error) {
        throw new Error(`Failed to create embed: ${error.message}`);
      }
    }
  },
};
