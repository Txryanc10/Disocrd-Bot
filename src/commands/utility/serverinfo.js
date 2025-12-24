// Serverinfo Command
// Shows server information

import {
  SlashCommandBuilder,
  time,
} from 'discord.js';
import logger from '../../utils/logger.js';
import { customEmbed } from '../../utils/embedBuilder.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get server information'),

  async execute(interaction, client) {
    try {
      const guild = interaction.guild;

      const infoEmbed = customEmbed({
        color: config.colors.info,
        title: `📊 ${guild.name}`,
        thumbnail: guild.iconURL({ dynamic: true }),
        fields: [
          { name: 'Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Channels', value: `${guild.channels.cache.filter(ch => ch.isTextBased()).size} Text`, inline: true },
          { name: 'Voice Channels', value: `${guild.channels.cache.filter(ch => ch.isVoiceBased()).size}`, inline: true },
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
          { name: 'Emojis', value: `${guild.emojis.cache.size}`, inline: true },
          { name: 'Created', value: time(guild.createdAt, 'D'), inline: false },
        ],
        footer: { text: `Guild ID: ${guild.id}` }
      });

      await interaction.reply({ embeds: [infoEmbed] });

      logger.success(`Server info viewed by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to get server info: ${error.message}`);
    }
  },
};
