// 8ball Command
// Magic 8-ball responses

import {
  SlashCommandBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import { infoEmbed } from '../../utils/embedBuilder.js';

const responses = [
  'Yes, definitely!',
  'No, absolutely not.',
  'Maybe, ask again later.',
  'Without a doubt.',
  'Very doubtful.',
  'It is certain.',
  'Don\'t count on it.',
  'Outlook good.',
  'Signs point to yes.',
  'My sources say no.',
  'Concentrate and ask again.',
  'Better not tell you now.',
  'Cannot predict now.',
];

export default {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your question')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const question = interaction.options.getString('question');
      const answer = responses[Math.floor(Math.random() * responses.length)];

      const ballEmbed = infoEmbed('Magic 8-Ball', answer, {
        fields: [
          { name: 'Question', value: question, inline: false }
        ],
        footer: 'Ask the universe...'
      });

      await interaction.reply({ embeds: [ballEmbed] });

      logger.success(`Magic 8-ball used by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to use magic 8-ball: ${error.message}`);
    }
  },
};
