// Gstart Command
// Start a new giveaway

import {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { hasPermission, botHasPermission } from '../../utils/permissions.js';
import { createGiveaway, getActiveGiveaways } from '../../utils/giveawayManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('gstart')
    .setDescription('Start a new giveaway')
    .addStringOption(option =>
      option
        .setName('prize')
        .setDescription('Prize for the giveaway')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true)
        .setMinValue(1)
    )
    .addIntegerOption(option =>
      option
        .setName('winners')
        .setDescription('Number of winners')
        .setRequired(true)
        .setMinValue(1)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    const prize = interaction.options.getString('prize');
    const durationMinutes = interaction.options.getInteger('duration');
    const winners = interaction.options.getInteger('winners');

    // Check permissions
    if (!hasPermission(interaction.member, 'ManageGuild')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Missing Permissions')
            .setDescription('You do not have permission to start giveaways.'),
        ],
        ephemeral: true,
      });
    }

    // Check bot permissions
    if (!botHasPermission(interaction.guild.members.me, 'SendMessages')) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Bot Missing Permissions')
            .setDescription('I do not have permission to send messages in this channel.'),
        ],
        ephemeral: true,
      });
    }

    try {
      const endTime = Date.now() + durationMinutes * 60 * 1000;
      const giveawayEmbed = new EmbedBuilder()
        .setColor(config.colors.giveaway)
        .setTitle('🎉 GIVEAWAY 🎉')
        .setDescription(`**Prize:** ${prize}`)
        .addFields(
          { name: 'Winners', value: `${winners}`, inline: true },
          { name: 'Duration', value: `${durationMinutes} minutes`, inline: true },
          { name: 'Ends At', value: `<t:${Math.floor(endTime / 1000)}:F>`, inline: false }
        )
        .setFooter({ text: 'React to enter!' })
        .setTimestamp();

      const button = new ButtonBuilder()
        .setCustomId('giveaway_enter')
        .setLabel('🎁 Enter Giveaway')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      const giveawayMessage = await interaction.channel.send({
        embeds: [giveawayEmbed],
        components: [row],
      });

      // Store giveaway data
      createGiveaway({
        messageId: giveawayMessage.id,
        channelId: interaction.channelId,
        guildId: interaction.guildId,
        prize,
        winners,
        endTime,
        ended: false,
        participants: [],
        createdBy: interaction.user.id,
      });

      const confirmEmbed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setTitle('✓ Giveaway Started')
        .addFields(
          { name: 'Prize', value: prize, inline: false },
          { name: 'Winners', value: `${winners}`, inline: true },
          { name: 'Duration', value: `${durationMinutes} minutes`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });

      // Schedule automatic end
      setTimeout(() => {
        endGiveaway(giveawayMessage.id, client);
      }, durationMinutes * 60 * 1000);

      logger.success(`Giveaway started: ${prize} by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed to start giveaway: ${error.message}`);
    }
  },
};

async function endGiveaway(messageId, client) {
  const allGiveaways = getActiveGiveaways();
  const giveaway = allGiveaways.find(g => g.messageId === messageId);

  if (!giveaway) return;

  try {
    const channel = await client.channels.fetch(giveaway.channelId);
    const message = await channel.messages.fetch(messageId);

    if (giveaway.participants.length === 0) {
      const noWinnersEmbed = new EmbedBuilder()
        .setColor(config.colors.giveaway)
        .setTitle('🎉 Giveaway Ended')
        .setDescription(`**Prize:** ${giveaway.prize}`)
        .addFields(
          { name: 'Result', value: 'No winners - no participants!', inline: false }
        )
        .setTimestamp();

      await message.edit({ embeds: [noWinnersEmbed], components: [] });
      return;
    }

    // Select random winners
    const selectedWinners = [];
    const participantsCopy = [...giveaway.participants];

    for (let i = 0; i < Math.min(giveaway.winners, participantsCopy.length); i++) {
      const randomIndex = Math.floor(Math.random() * participantsCopy.length);
      selectedWinners.push(participantsCopy[randomIndex]);
      participantsCopy.splice(randomIndex, 1);
    }

    const winnersText = selectedWinners
      .map(id => `<@${id}>`)
      .join(', ');

    const endedEmbed = new EmbedBuilder()
      .setColor(config.colors.giveaway)
      .setTitle('🎉 Giveaway Ended')
      .setDescription(`**Prize:** ${giveaway.prize}`)
      .addFields(
        { name: 'Winners', value: winnersText || 'No winners', inline: false },
        { name: 'Participants', value: `${giveaway.participants.length}`, inline: true }
      )
      .setTimestamp();

    await message.edit({ embeds: [endedEmbed], components: [] });

    // Notify winners
    const winnerText = selectedWinners.map(id => `<@${id}>`).join(' ');
    await channel.send({
      content: `🎉 Congratulations ${winnerText}! You won **${giveaway.prize}**!`,
    });

    logger.success(`Giveaway ended: ${giveaway.prize} with ${selectedWinners.length} winners`);
  } catch (error) {
    logger.error(`Failed to end giveaway: ${error.message}`);
  }
}
