// Deleterole Command
// Delete a role

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
    .setName('deleterole')
    .setDescription('Delete a role')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role to delete')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const role = interaction.options.getRole('role');

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

    // Cannot delete @everyone role
    if (role.id === interaction.guild.id) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Delete Role')
            .setDescription('You cannot delete the @everyone role.'),
        ],
        ephemeral: true,
      });
    }

    // Check role hierarchy
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Delete Role')
            .setDescription('I cannot delete a role that is equal to or higher than my highest role.'),
        ],
        ephemeral: true,
      });
    }

    try {
      const roleName = role.name;
      await role.delete(`Role deleted by ${interaction.user.tag}`);

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Role Deleted')
        .addFields(
          { name: 'Role', value: roleName, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

      logger.success(`Role deleted: ${roleName} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to delete role: ${error.message}`);
    }
  },
};
