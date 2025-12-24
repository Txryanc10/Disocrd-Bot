// Play Command
// Play music from YouTube

import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import {
  joinVoiceChannel,
  getVoiceConnection,
} from '@discordjs/voice';
import { play } from 'play-dl';
import { getPlayer, addToQueue, getNowPlaying } from '../../utils/musicPlayer.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music from YouTube')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Song name or YouTube URL')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const query = interaction.options.getString('query');

      // Check if user is in a voice channel
      if (!interaction.member.voice.channel) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Not In Voice Channel')
              .setDescription('You must be in a voice channel to use this command.'),
          ],
          ephemeral: true,
        });
      }

      const voiceChannel = interaction.member.voice.channel;

      // Check if bot can join the channel
      if (voiceChannel.type === ChannelType.GuildStageVoice) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Cannot Join Stage Channel')
              .setDescription('I cannot join stage channels.'),
          ],
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      // Search for the song
      let stream;
      try {
        const videoFinder = await play.search(query, { limit: 1 });
        
        if (!videoFinder || videoFinder.length === 0) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ No Results')
                .setDescription(`No results found for "${query}".`),
            ],
          });
        }

        stream = await play.stream(videoFinder[0].url);
      } catch (error) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Error')
              .setDescription('Failed to fetch the song. Try again later.'),
          ],
        });
      }

      // Add song to queue
      const song = {
        title: stream.video_details?.title || 'Unknown Song',
        url: query,
        thumbnail: stream.video_details?.thumbnails?.[0]?.url || null,
      };

      addToQueue(interaction.guildId, song);

      // Create or get voice connection
      let connection = getVoiceConnection(interaction.guildId);
      if (!connection) {
        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
      }

      const playEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('🎵 Added to Queue')
        .setDescription(song.title)
        .addFields(
          { name: 'Channel', value: voiceChannel.name, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [playEmbed] });

      logger.success(`Song queued: ${song.title} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to play song: ${error.message}`);
    }
  },
};
