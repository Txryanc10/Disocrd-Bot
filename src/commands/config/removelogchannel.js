/**
 * Remove Log Channel Command
 * Removes the moderation log channel setting for the server
 * 
 * Usage: /removelogchannel
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
        .setName('removelogchannel')
        .setDescription('Remove the moderation log channel setting'),

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

            const currentConfig = serverConfigManager.getServerConfig(interaction.guildId);

            if (!currentConfig.logChannel) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ No Log Channel Set')
                    .setDescription('There is no log channel configured for this server');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Remove the log channel
            serverConfigManager.removeLogChannel(interaction.guildId);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Log Channel Removed')
                .setDescription('The moderation log channel has been removed');

            await interaction.reply({ embeds: [embed], ephemeral: true });
            logger.success(`[${interaction.guildId}] Log channel removed`);

        } catch (error) {
            logger.error(`Error in removelogchannel: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while removing the log channel');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
