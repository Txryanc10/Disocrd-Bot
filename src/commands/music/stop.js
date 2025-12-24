// Stop Command
// Stop music playback

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { clearQueue } from '../../utils/musicPlayer.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music playback'),

  async execute(interaction, client) {
    try {
      const connection = getVoiceConnection(interaction.guildId);

      if (!connection) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Not Playing')
              .setDescription('I am not connected to a voice channel.'),
          ],
          ephemeral: true,
        });
      }

      // Clear queue and disconnect
      clearQueue(interaction.guildId);
      connection.destroy();

      const stopEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('⏹️ Music Stopped')
        .setDescription('Music playback stopped and queue cleared.')
        .setTimestamp();

      await interaction.reply({ embeds: [stopEmbed] });

      logger.success(`Music stopped by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to stop music: ${error.message}`);
    }
  },
};
