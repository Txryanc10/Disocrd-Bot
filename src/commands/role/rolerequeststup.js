/**
 * Configure Role Request System
 * Set up how role requests work in your server
 * 
 * Usage: /rolerequeststup <channel|dm> <approver-role>
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
        .setName('rolerequeststup')
        .setDescription('Configure the role request system')
        .addStringOption(option =>
            option
                .setName('method')
                .setDescription('How approvers are notified')
                .setRequired(true)
                .addChoices(
                    { name: 'Channel Notifications', value: 'channel' },
                    { name: 'DM Notifications', value: 'dm' }
                )
        )
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Channel for notifications (if method is channel)')
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option =>
            option
                .setName('approverrole')
                .setDescription('Role that can approve requests')
                .setRequired(true)
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

            const method = interaction.options.getString('method');
            const channel = interaction.options.getChannel('channel');
            const approverRole = interaction.options.getRole('approverrole');

            // Validate based on method
            if (method === 'channel' && !channel) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Missing Channel')
                    .setDescription('Channel is required when using channel notifications');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Check permissions for channel if needed
            if (channel && !botHasPermission(channel, 'SEND_MESSAGES')) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Missing Permissions')
                    .setDescription(`I don't have permission to send messages in ${channel}`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Configure role request system
            const config_obj = {
                roleRequestEnabled: true,
                roleRequestChannel: method === 'channel' ? channel?.id : null,
                roleRequestUseDM: method === 'dm',
                roleRequestApproverRoleId: approverRole.id
            };

            serverConfigManager.setTicketConfig(interaction.guildId, config_obj);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Role Request System Configured')
                .setDescription('Users can now request roles')
                .addFields(
                    { name: '📢 Notification Method', value: method === 'channel' ? '📋 Channel' : '💬 DM', inline: true },
                    method === 'channel' 
                        ? { name: 'Notification Channel', value: `${channel}`, inline: true }
                        : { name: 'Approvers', value: 'Get DMs', inline: true },
                    { name: '👮 Approver Role', value: `${approverRole}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            logger.success(`[${interaction.guildId}] Role request system configured (method: ${method})`);

        } catch (error) {
            logger.error(`Error in rolerequeststup: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while configuring the role request system');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
