// Ping Command
// Shows bot latency

import {
  SlashCommandBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import { infoEmbed } from '../../utils/embedBuilder.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),

  async execute(interaction, client) {
    try {
      const sent = await interaction.deferReply({ fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = Math.round(client.ws.ping);

      const pingEmbed = infoEmbed('Pong!', null, {
        fields: [
          { name: 'Bot Latency', value: `${latency}ms`, inline: true },
          { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
        ],
        footer: `Latency Check • ${new Date().toLocaleTimeString()}`
      });

      await interaction.editReply({ embeds: [pingEmbed] });

      logger.success(`Ping checked by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to check ping: ${error.message}`);
    }
  },
};
