/**
 * Create Ticket Command
 * Opens a new support ticket
 * 
 * Usage: /ticket <reason>
 * Can also be triggered via button interaction
 * 
 * Required Permissions: None (any user can create)
 */

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a support ticket')
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for opening this ticket')
                .setRequired(true)
                .setMaxLength(100)
        ),

    async execute(interaction) {
        try {
            const ticketConfig = serverConfigManager.getTicketConfig(interaction.guildId);

            if (!ticketConfig.enabled) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Ticket System Disabled')
                    .setDescription('The ticket system is not enabled for this server');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            const reason = interaction.options.getString('reason');
            const ticketId = serverConfigManager.getNextTicketId(interaction.guildId);

            try {
                // Create ticket channel
                const category = await interaction.guild.channels.fetch(ticketConfig.category);
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${ticketId}`,
                    type: 13, // GUILD_PRIVATE_THREAD or create in category
                    parent: ticketConfig.category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                        },
                        {
                            id: ticketConfig.modRole,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                        }
                    ]
                });

                // Send ticket info
                const ticketEmbed = new EmbedBuilder()
                    .setColor(config.colors.giveaway)
                    .setTitle(`🎫 Ticket #${ticketId}`)
                    .setDescription(`Support ticket created by ${interaction.user}`)
                    .addFields(
                        { name: '👤 User', value: `${interaction.user}`, inline: true },
                        { name: '🆔 Ticket ID', value: `#${ticketId}`, inline: true },
                        { name: '❓ Reason', value: reason, inline: false }
                    )
                    .setTimestamp();

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
                    .addFields(
                        { name: '🆔 Ticket ID', value: `#${ticketId}`, inline: true },
                        { name: '📝 Reason', value: reason, inline: true }
                    )
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

        } catch (error) {
            logger.error(`Error in ticket: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while creating your ticket');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
