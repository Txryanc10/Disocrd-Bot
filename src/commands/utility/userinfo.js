// Userinfo Command
// Shows user information

import {
  SlashCommandBuilder,
  EmbedBuilder,
  time,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get user information')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to get info about')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

      const infoEmbed = new EmbedBuilder()
        .setColor(member?.roles.highest.color || config.colors.info)
        .setTitle(`ℹ️ ${targetUser.tag}`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User ID', value: targetUser.id, inline: false },
          { name: 'Account Created', value: time(targetUser.createdAt, 'F'), inline: false },
          { name: 'Joined Server', value: member ? time(member.joinedAt, 'F') : 'N/A', inline: false },
          { name: 'Roles', value: member ? (member.roles.cache.size > 1 ? member.roles.cache.map(r => r.toString()).join(', ') : 'None') : 'N/A', inline: false },
          { name: 'Highest Role', value: member?.roles.highest.toString() || 'N/A', inline: true },
          { name: 'Bot', value: targetUser.bot ? 'Yes' : 'No', inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [infoEmbed] });

      logger.success(`User info viewed for ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  },
};
