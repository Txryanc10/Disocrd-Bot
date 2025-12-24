// Nowplaying Command
// Show currently playing song

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { getNowPlaying } from '../../utils/musicPlayer.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing song'),

  async execute(interaction, client) {
    try {
      const nowPlaying = getNowPlaying(interaction.guildId);

      if (!nowPlaying) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.info)
              .setTitle('🎵 Now Playing')
              .setDescription('No song is currently playing.'),
          ],
        });
      }

      const nowPlayingEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('🎵 Now Playing')
        .setDescription(nowPlaying.title || 'Unknown Song')
        .setTimestamp();

      if (nowPlaying.thumbnail) {
        nowPlayingEmbed.setThumbnail(nowPlaying.thumbnail);
      }

      await interaction.reply({ embeds: [nowPlayingEmbed] });

      logger.success(`Now playing viewed by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to get now playing: ${error.message}`);
    }
  },
};
