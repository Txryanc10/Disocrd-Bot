// Remind Command
// Set a reminder

import {
  SlashCommandBuilder,
  EmbedBuilder,
  time,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

const reminders = new Map();

export default {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addIntegerOption(option =>
      option
        .setName('minutes')
        .setDescription('Minutes until reminder')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10080) // 1 week
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Reminder message')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const minutes = interaction.options.getInteger('minutes');
      const message = interaction.options.getString('message');
      const reminderTime = Date.now() + minutes * 60 * 1000;

      const reminderEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Reminder Set')
        .addFields(
          { name: 'Message', value: message, inline: false },
          { name: 'Remind At', value: time(new Date(reminderTime), 'F'), inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [reminderEmbed], ephemeral: true });

      // Set timeout for reminder
      setTimeout(() => {
        const reminderDueEmbed = new EmbedBuilder()
          .setColor(config.colors.info)
          .setTitle('⏰ Reminder')
          .setDescription(message)
          .setFooter({ text: `Reminder set at: ${new Date().toLocaleString()}` })
          .setTimestamp();

        interaction.user.send({ embeds: [reminderDueEmbed] }).catch(() => {
          interaction.channel.send({
            content: `<@${interaction.user.id}>`,
            embeds: [reminderDueEmbed],
          });
        });
      }, minutes * 60 * 1000);

      logger.success(`Reminder set by ${interaction.user.tag} for ${minutes} minutes`);
    } catch (error) {
      throw new Error(`Failed to set reminder: ${error.message}`);
    }
  },
};
