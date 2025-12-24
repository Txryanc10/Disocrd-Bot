// Addrole Command
// Add a role to a user

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, botHasPermission, canInteract } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a role to a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to add role to')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role to add')
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

    // Check role hierarchy
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Assign Role')
            .setDescription('I cannot assign a role that is equal to or higher than my highest role.'),
        ],
        ephemeral: true,
      });
    }

    if (role.position >= interaction.member.roles.highest.position) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Assign Role')
            .setDescription('You cannot assign a role that is equal to or higher than your highest role.'),
        ],
        ephemeral: true,
      });
    }

    // Check if user already has the role
    if (targetMember.roles.cache.has(role.id)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.warning)
            .setTitle('⚠️ User Already Has Role')
            .setDescription(`${targetUser.tag} already has the ${role} role.`),
        ],
        ephemeral: true,
      });
    }

    try {
      // Add role to user
      await targetMember.roles.add(role);

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Role Added')
        .addFields(
          { name: 'User', value: targetUser.tag, inline: false },
          { name: 'Role', value: role.toString(), inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

      logger.success(`Role ${role.name} added to ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to add role: ${error.message}`);
    }
  },
};
