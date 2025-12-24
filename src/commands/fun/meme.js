// Meme Command
// Fetch random memes

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import axios from 'axios';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),

  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      const response = await axios.get('https://meme-api.com/gimme');
      const meme = response.data;

      const memeEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle(meme.title)
        .setImage(meme.url)
        .addFields(
          { name: 'Subreddit', value: meme.subreddit, inline: true },
          { name: 'Upvotes', value: `${meme.ups}`, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [memeEmbed] });

      logger.success(`Meme fetched by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to fetch meme: ${error.message}`);
    }
  },
};
