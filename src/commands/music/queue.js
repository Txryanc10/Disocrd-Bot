// Queue Command
// Show music queue

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { getQueue, getNowPlaying } from '../../utils/musicPlayer.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the music queue'),

  async execute(interaction, client) {
    try {
      const queue = getQueue(interaction.guildId);
      const nowPlaying = getNowPlaying(interaction.guildId);

      if (queue.length === 0 && !nowPlaying) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.info)
              .setTitle('📋 Queue')
              .setDescription('The queue is empty.'),
          ],
        });
      }

      const queueEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('📋 Music Queue')
        .setTimestamp();

      if (nowPlaying) {
        queueEmbed.addFields({
          name: '🎵 Now Playing',
          value: nowPlaying.title || 'Unknown',
          inline: false,
        });
      }

      if (queue.length > 0) {
        let queueText = '';
        queue.slice(0, 10).forEach((song, index) => {
          queueText += `${index + 1}. ${song.title || 'Unknown'}\n`;
        });

        queueEmbed.addFields({
          name: `⏳ Up Next (${queue.length} songs)`,
          value: queueText || 'No songs queued',
          inline: false,
        });

        if (queue.length > 10) {
          queueEmbed.addFields({
            name: 'And more...',
            value: `+${queue.length - 10} more songs`,
            inline: false,
          });
        }
      }

      await interaction.reply({ embeds: [queueEmbed] });

      logger.success(`Queue viewed by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to view queue: ${error.message}`);
    }
  },
};
