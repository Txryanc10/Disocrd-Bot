/**
 * View Pending Role Requests Command
 * See all pending role requests
 * 
 * Usage: /rolerequests
 * 
 * Required Permissions: Approver role (configured by admin)
 */

import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import roleRequestManager from '../../utils/roleRequestManager.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rolerequests')
        .setDescription('View all pending role requests'),

    async execute(interaction) {
        try {
            const guildConfig = serverConfigManager.getServerConfig(interaction.guildId);

            // Check if user is an approver
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!member.roles.cache.has(guildConfig.roleRequestApproverRoleId)) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Permission Denied')
                    .setDescription('You are not an approver for role requests');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Get pending requests
            const requests = roleRequestManager.getPendingRequests(interaction.guildId);

            if (requests.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.info)
                    .setTitle('📭 No Pending Requests')
                    .setDescription('There are no pending role requests');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Create embed with requests
            const embed = new EmbedBuilder()
                .setColor(config.colors.info)
                .setTitle(`🔔 Pending Role Requests (${requests.length})`)
                .setDescription(`There are **${requests.length}** pending request(s)`);

            // Add up to 10 requests
            for (let i = 0; i < Math.min(requests.length, 10); i++) {
                const req = requests[i];
                const createdDate = new Date(req.createdAt).toLocaleString();
                
                embed.addFields({
                    name: `#${i + 1} - ${req.userName}`,
                    value: `**Role:** ${req.roleName}\n**Requested:** ${createdDate}\n**Status:** Pending approval`,
                    inline: false
                });
            }

            if (requests.length > 10) {
                embed.setFooter({ text: `Showing 10 of ${requests.length} requests` });
            }

            embed.setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            logger.success(`[${interaction.guildId}] Pending requests viewed`);

        } catch (error) {
            logger.error(`Error in rolerequests: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while fetching role requests');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
