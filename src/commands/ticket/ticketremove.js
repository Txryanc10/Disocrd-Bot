/**
 * Remove User from Ticket Command
 * Removes a user from a support ticket
 * 
 * Usage: /ticketremove <user>
 * 
 * Required Permissions: Moderator role
 */

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ticketremove')
        .setDescription('Remove a user from this ticket')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to remove from the ticket')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const channel = interaction.channel;

            // Check if this is a ticket channel
            if (!channel.name.startsWith('ticket-')) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Not a Ticket Channel')
                    .setDescription('This command can only be used in a ticket channel');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const ticketConfig = serverConfigManager.getTicketConfig(interaction.guildId);
            const user = interaction.options.getUser('user');

            // Check permissions
            const isMod = interaction.member.roles.cache.has(ticketConfig.modRole);
            const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);

            if (!isMod && !isAdmin) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Permission Denied')
                    .setDescription('Only moderators can remove users from tickets');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Remove user permissions
            await channel.permissionOverwrites.edit(user, {
                ViewChannel: false,
                SendMessages: false,
                ReadMessageHistory: false
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ User Removed')
                .setDescription(`${user} has been removed from this ticket`);

            await interaction.reply({ embeds: [embed] });
            logger.success(`[${interaction.guildId}] ${user.tag} removed from ticket by ${interaction.user.tag}`);

        } catch (error) {
            logger.error(`Error in ticketremove: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while removing the user');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
