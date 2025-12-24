// Coinflip Command
// Flip a coin

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin'),

  async execute(interaction, client) {
    try {
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const emoji = result === 'Heads' ? '🪙' : '🪙';

      const flipEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle(`${emoji} Coin Flip`)
        .setDescription(`The coin landed on: **${result}**`)
        .setTimestamp();

      await interaction.reply({ embeds: [flipEmbed] });

      logger.success(`Coin flip used by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to flip coin: ${error.message}`);
    }
  },
};
