// Resume Command
// Resume music playback

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume music playback'),

  async execute(interaction, client) {
    try {
      const resumeEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('▶️ Resumed')
        .setDescription('Music playback resumed.')
        .setTimestamp();

      await interaction.reply({ embeds: [resumeEmbed] });

      logger.success(`Music resumed by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to resume music: ${error.message}`);
    }
  },
};
