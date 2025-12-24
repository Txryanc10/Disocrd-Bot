// Ship Command
// Ship two users together

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Ship two users')
    .addUserOption(option =>
      option
        .setName('user1')
        .setDescription('First user')
        .setRequired(true)
    )
    .addUserOption(option =>
      option
        .setName('user2')
        .setDescription('Second user')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const user1 = interaction.options.getUser('user1');
      const user2 = interaction.options.getUser('user2');

      const compatibility = Math.floor(Math.random() * 101);
      const hearts = '❤️'.repeat(Math.ceil(compatibility / 20));

      const shipEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('💕 Ship')
        .addFields(
          { name: 'Users', value: `${user1.tag} + ${user2.tag}`, inline: false },
          { name: 'Compatibility', value: `${compatibility}% ${hearts}`, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [shipEmbed] });

      logger.success(`Ship used by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to ship users: ${error.message}`);
    }
  },
};
