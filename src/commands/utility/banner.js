// Banner Command
// Shows user's banner

import {
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Get user banner')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to get banner for')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      
      // Fetch full user data to get banner
      const fullUser = await client.users.fetch(targetUser.id, { force: true });
      const bannerUrl = fullUser.bannerURL({ dynamic: true, size: 4096 });

      if (!bannerUrl) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.warning)
              .setTitle(`${targetUser.tag}'s Banner`)
              .setDescription('This user does not have a banner set.'),
          ],
        });
      }

      const bannerEmbed = new EmbedBuilder()
        .setColor(config.colors.info)
        .setTitle(`${targetUser.tag}'s Banner`)
        .setImage(bannerUrl)
        .addFields(
          { name: 'Download', value: `[Click here](${bannerUrl})`, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [bannerEmbed] });

      logger.success(`Banner viewed for ${targetUser.tag} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to get banner: ${error.message}`);
    }
  },
};
