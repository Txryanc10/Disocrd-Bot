// Howgay Command
// How gay is someone (fun command)

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('Check how gay someone is')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to check')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const gayness = Math.floor(Math.random() * 101);
      const rainbow = '🌈'.repeat(Math.ceil(gayness / 25));

      const gayEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('🌈 Gay Meter')
        .addFields(
          { name: 'User', value: targetUser.tag, inline: false },
          { name: 'Gayness Level', value: `${gayness}% ${rainbow}`, inline: false },
          { name: 'Verdict', value: gayness >= 80 ? '🏳️‍🌈 Very Gay!' : gayness >= 50 ? '🌈 Somewhat Gay' : '👀 Not Gay', inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [gayEmbed] });

      logger.success(`Gay meter used on ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to use gay meter: ${error.message}`);
    }
  },
};
