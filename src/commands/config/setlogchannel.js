/**
 * Set Log Channel Command
 * Allows server admins to set where moderation logs are sent
 * 
 * Usage: /setlogchannel <channel>
 * 
 * Required Permissions: MANAGE_GUILD
 */

import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { hasPermission, botHasPermission } from '../../utils/permissions.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Set the moderation log channel for this server')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The channel to send logs to')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

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

            const channel = interaction.options.getChannel('channel');

            // Check if bot can send messages to the channel
            if (!botHasPermission(channel, 'SEND_MESSAGES')) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Missing Permissions')
                    .setDescription(`I don't have permission to send messages in ${channel}`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Set the log channel
            serverConfigManager.setLogChannel(interaction.guildId, channel.id);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Log Channel Set')
                .setDescription(`All moderation logs will now be sent to ${channel}`)
                .addFields(
                    { name: 'Channel', value: `${channel}`, inline: true },
                    { name: 'Channel ID', value: channel.id, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            logger.success(`[${interaction.guildId}] Log channel set to ${channel.id}`);

        } catch (error) {
            logger.error(`Error in setlogchannel: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while setting the log channel');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
