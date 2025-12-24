/**
 * Close Ticket Command
 * Closes a support ticket
 * 
 * Usage: /closeticket
 * Can also be triggered via button interaction in ticket channel
 * 
 * Required Permissions: Moderator role or ticket creator
 */

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('closeticket')
        .setDescription('Close a support ticket'),

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

            // Check permissions - only mods or ticket creator can close
            const isMod = interaction.member.roles.cache.has(ticketConfig.modRole);
            const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);

            if (!isMod && !isAdmin) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Permission Denied')
                    .setDescription('Only moderators can close tickets');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await interaction.deferReply();

            const ticketId = channel.name.split('-')[1];

            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle('⏳ Closing Ticket...')
                .setDescription(`Ticket #${ticketId} will be deleted in 5 seconds`);

            await interaction.editReply({ embeds: [embed] });

            // Wait 5 seconds then delete
            setTimeout(async () => {
                try {
                    await channel.delete();
                    logger.success(`[${interaction.guildId}] Ticket #${ticketId} closed by ${interaction.user.tag}`);
                } catch (error) {
                    logger.error(`Error deleting ticket channel: ${error.message}`);
                }
            }, 5000);

        } catch (error) {
            logger.error(`Error in closeticket: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while closing the ticket');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
