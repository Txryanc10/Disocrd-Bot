// Roleinfo Command
// Get information about a role

import {
  SlashCommandBuilder,
  EmbedBuilder,
  time,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Get information about a role')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role to get info about')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const role = interaction.options.getRole('role');

    try {
      // Count members with this role
      const memberCount = role.members.size;

      const infoEmbed = new EmbedBuilder()
        .setColor(role.hexColor || config.colors.info)
        .setTitle(`ℹ️ Role Information`)
        .addFields(
          { name: 'Role Name', value: role.name, inline: false },
          { name: 'Role ID', value: role.id, inline: false },
          { name: 'Mention', value: role.toString(), inline: false },
          { name: 'Color', value: role.hexColor || 'Default', inline: true },
          { name: 'Position', value: `${role.position}`, inline: true },
          { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
          { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
          { name: 'Managed', value: role.managed ? 'Yes' : 'No', inline: true },
          { name: 'Members', value: `${memberCount}`, inline: true },
          { name: 'Created', value: time(role.createdAt, 'F'), inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [infoEmbed] });

      logger.success(`Role info viewed: ${role.name} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to get role info: ${error.message}`);
    }
  },
};
