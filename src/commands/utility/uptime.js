// Uptime Command
// Shows bot uptime

import {
  SlashCommandBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import { successEmbed } from '../../utils/embedBuilder.js';

export default {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Check bot uptime'),

  async execute(interaction, client) {
    try {
      const uptime = client.uptime;
      const days = Math.floor(uptime / 86400000);
      const hours = Math.floor((uptime % 86400000) / 3600000);
      const minutes = Math.floor((uptime % 3600000) / 60000);
      const seconds = Math.floor((uptime % 60000) / 1000);

      const uptimeText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const uptimeEmbed = successEmbed('Uptime', uptimeText, {
        fields: [
          { name: 'Days', value: `${days}`, inline: true },
          { name: 'Hours', value: `${hours}`, inline: true },
          { name: 'Minutes', value: `${minutes}`, inline: true },
          { name: 'Seconds', value: `${seconds}`, inline: true }
        ],
        footer: 'Bot Uptime'
      });

      await interaction.reply({ embeds: [uptimeEmbed] });

      logger.success(`Uptime checked by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to check uptime: ${error.message}`);
    }
  },
};
