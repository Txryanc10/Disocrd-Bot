// Roast Command
// Roast a user with random insults

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

const roasts = [
  'You\'re as useful as a chocolate teapot.',
  'I\'d roast you, but you\'re not worth the calories.',
  'Your jokes are older than the internet.',
  'You\'re the human equivalent of a participation trophy.',
  'If you were a vegetable, you\'d be a turnip.',
  'You\'re so boring, even your shadow left you.',
  'I\'d insult you, but I\'m afraid it would go over your head.',
  'You\'re like a book without any pages.',
  'Your personality is like a blank canvas.',
  'You\'re the reason they invented the mute button.',
  'If you were any less intelligent, we\'d have to water you.',
  'You\'re proof that evolution can go backwards.',
];

export default {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('Roast a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to roast')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const roast = roasts[Math.floor(Math.random() * roasts.length)];

      const roastEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('🔥 Roasted')
        .addFields(
          { name: 'User', value: targetUser.tag, inline: false },
          { name: 'Roast', value: roast, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [roastEmbed] });

      logger.success(`User roasted: ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to roast user: ${error.message}`);
    }
  },
};
