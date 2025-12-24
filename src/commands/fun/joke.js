// Joke Command
// Fetch random jokes

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import axios from 'axios';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),

  async execute(interaction, client) {
    try {
      await interaction.deferReply();

      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const joke = response.data;

      const jokeEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('😂 Joke')
        .setDescription(`**Setup:** ${joke.setup}\n\n**Punchline:** ||${joke.punchline}||`)
        .addFields(
          { name: 'Type', value: joke.type, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [jokeEmbed] });

      logger.success(`Joke fetched by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to fetch joke: ${error.message}`);
    }
  },
};
