// Createrole Command
// Create a new role

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, botHasPermission } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Create a new role')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Name for the new role')
        .setRequired(true)
        .setMaxLength(100)
    )
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('Role color (hex format, e.g. #FF0000)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const roleName = interaction.options.getString('name');
    const colorInput = interaction.options.getString('color');

    // Check permissions
    if (!hasPermission(interaction.member, 'ManageRoles')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to manage roles.'),
        ],
        ephemeral: true,
      });
    }

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'ManageRoles')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to manage roles.'),
        ],
        ephemeral: true,
      });
    }

    try {
      // Create role
      const newRole = await interaction.guild.roles.create({
        name: roleName,
        color: colorInput || undefined,
        reason: `Role created by ${interaction.user.tag}`,
      });

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Role Created')
        .addFields(
          { name: 'Role', value: newRole.toString(), inline: false },
          { name: 'Role ID', value: newRole.id, inline: false },
          { name: 'Color', value: newRole.hexColor || '#000000', inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

      logger.success(`Role created: ${roleName} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to create role: ${error.message}`);
    }
  },
};
