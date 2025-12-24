// Interaction Handler
// Handles slash command interactions and button interactions
// Supports per-server logging and ticket system

import logger from '../utils/logger.js';
import { isOnCooldown, setCooldown } from '../utils/cooldown.js';
import config from '../config/config.js';
import { EmbedBuilder } from 'discord.js';
import serverConfigManager from '../utils/serverConfigManager.js';

/**
 * Send a message to the server's log channel (if configured)
 */
async function sendLogMessage(guildId, embed, client) {
  try {
    const logChannelId = serverConfigManager.getLogChannel(guildId);
    if (!logChannelId) return;

    const channel = await client.channels.fetch(logChannelId);
    if (channel && channel.isSendable()) {
      await channel.send({ embeds: [embed] });
    }
  } catch (error) {
    logger.warn(`Could not send log message: ${error.message}`);
  }
}

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      
      if (!command) {
        logger.warn(`Command not found: ${interaction.commandName}`);
        return interaction.reply({
          content: '❌ Command not found!',
          ephemeral: true,
        });
      }
      
      try {
        // Check cooldown
        if (isOnCooldown(interaction.user.id, interaction.commandName, config.cooldownTime)) {
          return interaction.reply({
            content: '⏱️ You are on cooldown! Try again later.',
            ephemeral: true,
          });
        }
        
        // Set cooldown
        setCooldown(interaction.user.id, interaction.commandName, config.cooldownTime);
        
        // Execute command
        await command.execute(interaction, client);
        
        logger.success(
          `Command executed: ${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`
        );

        // Send to log channel if configured
        if (interaction.guild) {
          const logEmbed = new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle('📋 Command Executed')
            .setDescription(`**Command:** /${interaction.commandName}`)
            .addFields(
              { name: '👤 User', value: `${interaction.user.tag}`, inline: true },
              { name: '📍 Channel', value: `${interaction.channel}`, inline: true }
            )
            .setTimestamp();
          
          await sendLogMessage(interaction.guildId, logEmbed, client);
        }
      } catch (error) {
        logger.error(`Error executing command ${interaction.commandName}: ${error.message}`);
        logger.error(error.stack);
        
        const errorEmbed = new EmbedBuilder()
          .setColor(config.colors.error)
          .setTitle('❌ Command Error')
          .setDescription('An error occurred while executing this command.')
          .addFields({
            name: 'Error Details',
            value: `\`\`\`${error.message.substring(0, 1000)}\`\`\``,
          })
          .setTimestamp();
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      }
    }

    // Handle button interactions
    if (interaction.isButton()) {
      try {
        const customId = interaction.customId;

        // Ticket creation button
        if (customId === 'create_ticket') {
          const ticketConfig = serverConfigManager.getTicketConfig(interaction.guildId);

          if (!ticketConfig.enabled) {
            const embed = new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Ticket System Disabled')
              .setDescription('The ticket system is not enabled for this server');
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          await interaction.deferReply({ ephemeral: true });

          const ticketId = serverConfigManager.getNextTicketId(interaction.guildId);

          try {
            // Create ticket channel
            const channel = await interaction.guild.channels.create({
              name: `ticket-${ticketId}`,
              parent: ticketConfig.category,
              permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: ['ViewChannel'],
                },
                {
                  id: interaction.user.id,
                  allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                },
                {
                  id: ticketConfig.modRole,
                  allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                },
              ],
            });

            // Send ticket info
            const ticketEmbed = new EmbedBuilder()
              .setColor(config.colors.giveaway)
              .setTitle(`🎫 Ticket #${ticketId}`)
              .setDescription(`Support ticket created by ${interaction.user}`)
              .addFields(
                { name: '👤 User', value: `${interaction.user}`, inline: true },
                { name: '🆔 Ticket ID', value: `#${ticketId}`, inline: true }
              )
              .setTimestamp();

            const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
            const row = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId(`close_ticket_${ticketId}`)
                  .setLabel('🔒 Close Ticket')
                  .setStyle(ButtonStyle.Danger)
              );

            await channel.send({ embeds: [ticketEmbed], components: [row] });

            const successEmbed = new EmbedBuilder()
              .setColor(config.colors.success)
              .setTitle('✅ Ticket Created')
              .setDescription(`Your support ticket has been created: ${channel}`)
              .addFields({ name: '🆔 Ticket ID', value: `#${ticketId}`, inline: true })
              .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });
            logger.success(`[${interaction.guildId}] Ticket #${ticketId} created by ${interaction.user.tag}`);
          } catch (channelError) {
            logger.error(`Error creating ticket channel: ${channelError.message}`);
            const embed = new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Error Creating Ticket')
              .setDescription('Failed to create the ticket channel. Check category and permissions');
            await interaction.editReply({ embeds: [embed] });
          }
        }

        // Ticket close button
        if (customId.startsWith('close_ticket_')) {
          const channel = interaction.channel;
          const ticketConfig = serverConfigManager.getTicketConfig(interaction.guildId);

          const isMod = interaction.member.roles.cache.has(ticketConfig.modRole);
          const isAdmin = interaction.member.permissions.has('ManageGuild');

          if (!isMod && !isAdmin) {
            const embed = new EmbedBuilder()
              .setColor(config.colors.error)
              .setTitle('❌ Permission Denied')
              .setDescription('Only moderators can close tickets');
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          await interaction.deferReply();

          const ticketId = customId.split('_')[2];
          const embed = new EmbedBuilder()
            .setColor(config.colors.warning)
            .setTitle('⏳ Closing Ticket...')
            .setDescription(`Ticket #${ticketId} will be deleted in 5 seconds`);

          await interaction.editReply({ embeds: [embed] });

          setTimeout(async () => {
            try {
              await channel.delete();
              logger.success(`[${interaction.guildId}] Ticket #${ticketId} closed by ${interaction.user.tag}`);
            } catch (error) {
              logger.error(`Error deleting ticket channel: ${error.message}`);
            }
          }, 5000);
        }
      } catch (error) {
        logger.error(`Error handling button interaction: ${error.message}`);
        if (!interaction.replied && !interaction.deferred) {
          interaction.reply({ content: '❌ An error occurred', ephemeral: true });
        }
      }
    }
  },
};
