/**
 * Add User to Ticket Command
 * Adds a user to a support ticket
 * 
 * Usage: /ticketadd <user>
 * 
 * Required Permissions: Moderator role
 */

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ticketadd')
        .setDescription('Add a user to this ticket')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to add to the ticket')
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
                    .setDescription('Only moderators can add users to tickets');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Add user permissions
            await channel.permissionOverwrites.edit(user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ User Added')
                .setDescription(`${user} has been added to this ticket`);

            await interaction.reply({ embeds: [embed] });
            logger.success(`[${interaction.guildId}] ${user.tag} added to ticket by ${interaction.user.tag}`);

        } catch (error) {
            logger.error(`Error in ticketadd: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while adding the user');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
