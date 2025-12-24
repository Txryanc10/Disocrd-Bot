// Gend Command
// End a giveaway manually

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission } from '../../utils/permissions.js';
import { getGiveaway, updateGiveaway } from '../../utils/giveawayManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('End a giveaway manually')
    .addStringOption(option =>
      option
        .setName('messageid')
        .setDescription('Message ID of the giveaway')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const messageId = interaction.options.getString('messageid');

    // Check permissions
    if (!hasPermission(interaction.member, 'ManageGuild')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to manage giveaways.'),
        ],
        ephemeral: true,
      });
    }

    try {
      const giveaway = getGiveaway(messageId);

      if (!giveaway) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Giveaway Not Found')
              .setDescription('Could not find a giveaway with that message ID.'),
          ],
          ephemeral: true,
        });
      }

      if (giveaway.ended) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.warning)
              .setTitle('⚠️ Giveaway Already Ended')
              .setDescription('This giveaway has already ended.'),
          ],
          ephemeral: true,
        });
      }

      // Get the giveaway message
      const channel = await client.channels.fetch(giveaway.channelId);
      const message = await channel.messages.fetch(messageId);

      // Select winners
      const selectedWinners = [];
      const participantsCopy = [...giveaway.participants];

      for (let i = 0; i < Math.min(giveaway.winners, participantsCopy.length); i++) {
        const randomIndex = Math.floor(Math.random() * participantsCopy.length);
        selectedWinners.push(participantsCopy[randomIndex]);
        participantsCopy.splice(randomIndex, 1);
      }

      const winnersText = selectedWinners.map(id => `<@${id}>`).join(', ');

      const endedEmbed = new EmbedBuilder()
        .setColor(config.colors.giveaway)
        .setTitle('🎉 Giveaway Ended (Manual)')
        .setDescription(`**Prize:** ${giveaway.prize}`)
        .addFields(
          { name: 'Winners', value: winnersText || 'No winners', inline: false },
          { name: 'Participants', value: `${giveaway.participants.length}`, inline: true }
        )
        .setTimestamp();

      await message.edit({ embeds: [endedEmbed], components: [] });

      // Update giveaway data
      updateGiveaway(messageId, { ended: true });

      // Notify winners
      const winnerText = selectedWinners.map(id => `<@${id}>`).join(' ');
      if (selectedWinners.length > 0) {
        await channel.send({
          content: `🎉 Congratulations ${winnerText}! You won **${giveaway.prize}**!`,
        });
      }

      const confirmEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Giveaway Ended')
        .addFields(
          { name: 'Prize', value: giveaway.prize, inline: false },
          { name: 'Winners', value: `${selectedWinners.length}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });

      logger.success(`Giveaway ended manually: ${giveaway.prize} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to end giveaway: ${error.message}`);
    }
  },
};
