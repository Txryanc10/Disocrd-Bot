// Greroll Command
// Reroll giveaway winners

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission } from '../../utils/permissions.js';
import { getGiveaway } from '../../utils/giveawayManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('greroll')
    .setDescription('Reroll giveaway winners')
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

      if (!giveaway.ended) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.warning)
              .setTitle('⚠️ Giveaway Not Ended')
              .setDescription('This giveaway has not ended yet.'),
          ],
          ephemeral: true,
        });
      }

      if (giveaway.participants.length === 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.colors.warning)
              .setTitle('⚠️ No Participants')
              .setDescription('There are no participants in this giveaway.'),
          ],
          ephemeral: true,
        });
      }

      // Select new winners
      const selectedWinners = [];
      const participantsCopy = [...giveaway.participants];

      for (let i = 0; i < Math.min(giveaway.winners, participantsCopy.length); i++) {
        const randomIndex = Math.floor(Math.random() * participantsCopy.length);
        selectedWinners.push(participantsCopy[randomIndex]);
        participantsCopy.splice(randomIndex, 1);
      }

      const winnersText = selectedWinners.map(id => `<@${id}>`).join(', ');

      // Get the channel and send reroll message
      const channel = await client.channels.fetch(giveaway.channelId);

      const rerollEmbed = new EmbedBuilder()
        .setColor(config.colors.giveaway)
        .setTitle('🎉 Giveaway Rerolled')
        .setDescription(`**Prize:** ${giveaway.prize}`)
        .addFields(
          { name: 'New Winners', value: winnersText || 'No winners', inline: false }
        )
        .setTimestamp();

      await channel.send({ embeds: [rerollEmbed] });

      // Notify new winners
      const winnerText = selectedWinners.map(id => `<@${id}>`).join(' ');
      if (selectedWinners.length > 0) {
        await channel.send({
          content: `🎉 Congratulations ${winnerText}! You are the new winners of **${giveaway.prize}**!`,
        });
      }

      const confirmEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Giveaway Rerolled')
        .addFields(
          { name: 'Prize', value: giveaway.prize, inline: false },
          { name: 'New Winners', value: `${selectedWinners.length}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });

      logger.success(`Giveaway rerolled: ${giveaway.prize} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to reroll giveaway: ${error.message}`);
    }
  },
};
