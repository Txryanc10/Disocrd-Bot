// Pause Command
// Pause current song

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current song'),

  async execute(interaction, client) {
    try {
      const pauseEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('⏸️ Paused')
        .setDescription('Music playback paused.')
        .setTimestamp();

      await interaction.reply({ embeds: [pauseEmbed] });

      logger.success(`Music paused by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to pause music: ${error.message}`);
    }
  },
};
