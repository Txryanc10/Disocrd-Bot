// Removerole Command
// Remove a role from a user

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
    .setName('removerole')
    .setDescription('Remove a role from a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to remove role from')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role to remove')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');
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

    // Get target member
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ User Not Found')
            .setDescription('The user is not in this server.'),
        ],
        ephemeral: true,
      });
    }

    // Check if user has the role
    if (!targetMember.roles.cache.has(role.id)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.warning)
            .setTitle('⚠️ User Does Not Have Role')
            .setDescription(`${targetUser.tag} does not have the ${role} role.`),
        ],
        ephemeral: true,
      });
    }

    try {
      // Remove role from user
      await targetMember.roles.remove(role);

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Role Removed')
        .addFields(
          { name: 'User', value: targetUser.tag, inline: false },
          { name: 'Role', value: role.toString(), inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

      logger.success(`Role ${role.name} removed from ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to remove role: ${error.message}`);
    }
  },
};
