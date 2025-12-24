/**
 * Server Config Command
 * View the current server configuration
 * 
 * Usage: /serverconfig
 * 
 * Required Permissions: MANAGE_GUILD
 */

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { hasPermission } from '../../utils/permissions.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('serverconfig')
        .setDescription('View the current server configuration'),

    async execute(interaction) {
        try {
            // Check permission
            if (!hasPermission(interaction.member, 'MANAGE_GUILD')) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Permission Denied')
                    .setDescription('You need `MANAGE_GUILD` permission to use this command');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const guildConfig = serverConfigManager.getServerConfig(interaction.guildId);

            const embed = new EmbedBuilder()
                .setColor(config.colors.info)
                .setTitle('⚙️ Server Configuration')
                .setDescription(`Configuration for **${interaction.guild.name}**`)
                .addFields(
                    {
                        name: '📋 Log Channel',
                        value: guildConfig.logChannel ? `<#${guildConfig.logChannel}>` : 'Not set',
                        inline: true
                    },
                    {
                        name: '🎫 Tickets Enabled',
                        value: guildConfig.ticketEnabled ? '✅ Yes' : '❌ No',
                        inline: true
                    },
                    {
                        name: '🎫 Ticket Channel',
                        value: guildConfig.ticketChannel ? `<#${guildConfig.ticketChannel}>` : 'Not set',
                        inline: true
                    },
                    {
                        name: '🎫 Ticket Category',
                        value: guildConfig.ticketCategoryId ? `<#${guildConfig.ticketCategoryId}>` : 'Not set',
                        inline: true
                    },
                    {
                        name: '🎫 Ticket Mod Role',
                        value: guildConfig.ticketModRoleId ? `<@&${guildConfig.ticketModRoleId}>` : 'Not set',
                        inline: true
                    },
                    {
                        name: '🆔 Next Ticket ID',
                        value: `#${guildConfig.ticketNextId}`,
                        inline: true
                    }
                )
                .setFooter({ text: `Last updated: ${new Date(guildConfig.updatedAt).toLocaleString()}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            logger.success(`[${interaction.guildId}] Server config viewed`);

        } catch (error) {
            logger.error(`Error in serverconfig: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while fetching the server configuration');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
