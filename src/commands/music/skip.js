// Skip Command
// Skip current song

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { getQueue, getNowPlaying } from '../../utils/musicPlayer.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction, client) {
    try {
      const connection = getVoiceConnection(interaction.guildId);
      const queue = getQueue(interaction.guildId);
      const nowPlaying = getNowPlaying(interaction.guildId);

      if (!connection || !nowPlaying) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ No Song Playing')
              .setDescription('There is no song currently playing.'),
          ],
          ephemeral: true,
        });
      }

      if (queue.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.warning)
              .setTitle('⚠️ End of Queue')
              .setDescription('This is the last song in the queue.'),
          ],
          ephemeral: true,
        });
      }

      const skipEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('⏭️ Song Skipped')
        .setDescription(`Now playing: ${queue[0]?.title || 'Unknown Song'}`)
        .setTimestamp();

      await interaction.reply({ embeds: [skipEmbed] });

      logger.success(`Song skipped by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to skip song: ${error.message}`);
    }
  },
};
