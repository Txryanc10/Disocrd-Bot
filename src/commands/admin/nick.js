// Nick Command
// Changes a user's nickname

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, botHasPermission, canInteract, botCanInteract } from '../../utils/permissions.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Change a user\'s nickname')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to change nickname for')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('nickname')
        .setDescription('New nickname (max 32 characters, leave empty to reset)')
        .setRequired(false)
        .setMaxLength(32)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');
    const newNickname = interaction.options.getString('nickname') || null;

    // Check permissions
    if (!hasPermission(interaction.member, 'ManageNicknames')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to manage nicknames.'),
        ],
        ephemeral: true,
      });
    }

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'ManageNicknames')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to manage nicknames.'),
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

    if (!canInteract(interaction.member, targetMember)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Cannot Change Nickname')
            .setDescription(
              'You cannot change the nickname of a user with an equal or higher role than you.'
            ),
        ],
        ephemeral: true,
      });
    }

    try {
      // Set nickname
      await targetMember.setNickname(newNickname);

      const nicknameText = newNickname ? `**${newNickname}**` : 'Nickname reset';

      const successEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Nickname Updated')
        .addFields(
          { name: 'User', value: targetUser.tag, inline: false },
          { name: 'Nickname', value: nicknameText, inline: false },
          { name: 'Moderator', value: interaction.user.tag, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

      logger.success(`Nickname changed for ${targetUser.tag} to ${newNickname || 'reset'} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to change nickname: ${error.message}`);
    }
  },
};
