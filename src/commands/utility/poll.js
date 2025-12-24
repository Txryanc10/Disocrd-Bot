// Poll Command
// Create a simple poll

import {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Poll question')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('option1')
        .setDescription('First option')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('option2')
        .setDescription('Second option')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const question = interaction.options.getString('question');
      const option1 = interaction.options.getString('option1');
      const option2 = interaction.options.getString('option2');

      const pollEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle('📊 Poll')
        .setDescription(question)
        .addFields(
          { name: option1, value: '0 votes', inline: true },
          { name: option2, value: '0 votes', inline: true }
        )
        .setFooter({ text: `Poll by ${interaction.user.tag}` })
        .setTimestamp();

      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`poll_1`)
            .setLabel(option1)
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`poll_2`)
            .setLabel(option2)
            .setStyle(ButtonStyle.Primary)
        );

      await interaction.reply({ embeds: [pollEmbed], components: [buttons] });

      logger.success(`Poll created by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to create poll: ${error.message}`);
    }
  },
};
