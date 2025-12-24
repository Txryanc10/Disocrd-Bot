// Avatar Command
// Shows user's avatar

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get user avatar')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to get avatar for')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const avatarUrl = targetUser.displayAvatarURL({ dynamic: true, size: 4096 });

      const avatarEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle(`${targetUser.tag}'s Avatar`)
        .setImage(avatarUrl)
        .addFields(
          { name: 'Download', value: `[Click here](${avatarUrl})`, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [avatarEmbed] });

      logger.success(`Avatar viewed for ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to get avatar: ${error.message}`);
    }
  },
};
