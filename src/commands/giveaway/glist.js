// Glist Command
// List all active giveaways

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { getActiveGiveaways } from '../../utils/giveawayManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('glist')
    .setDescription('List all active giveaways'),

  async execute(interaction, client) {
    try {
      const activeGiveaways = getActiveGiveaways().filter(
        g => g.guildId === interaction.guildId
      );

      if (activeGiveaways.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.info)
              .setTitle('📋 Active Giveaways')
              .setDescription('There are no active giveaways.'),
          ],
        });
      }

      const listEmbed = new EmbedBuilder()
        .setColor(config.colors.giveaway)
        .setTitle(`📋 Active Giveaways (${activeGiveaways.length})`)
        .setTimestamp();

      activeGiveaways.forEach((giveaway, index) => {
        const endTime = new Date(giveaway.endTime);
        const now = new Date();
        const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000 / 60));

        listEmbed.addFields({
          name: `${index + 1}. ${giveaway.prize}`,
          value: `**Winners:** ${giveaway.winners}\n**Participants:** ${giveaway.participants.length}\n**Time Left:** ${timeLeft} minutes\n**Message ID:** \`${giveaway.messageId}\``,
          inline: false,
        });
      });

      await interaction.reply({ embeds: [listEmbed] });

      logger.success(`Giveaway list viewed by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to list giveaways: ${error.message}`);
    }
  },
};
