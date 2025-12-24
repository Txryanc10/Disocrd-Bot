/**
 * Ticket Setup Command
 * Configure the ticket system for your server
 * 
 * Usage: /ticketconfig <channel> <category> <modrole>
 * 
 * Required Permissions: MANAGE_GUILD
 */

import { SlashCommandBuilder, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { hasPermission, botHasPermission } from '../../utils/permissions.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ticketconfig')
        .setDescription('Configure the ticket system for this server')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Channel where the ticket button will be posted')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option
                .setName('category')
                .setDescription('Category where ticket channels will be created')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option
                .setName('modrole')
                .setDescription('Role that can manage tickets')
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

            const channel = interaction.options.getChannel('channel');
            const category = interaction.options.getChannel('category');
            const modRole = interaction.options.getRole('modrole');

            // Check if bot can send messages to the channel
            if (!botHasPermission(channel, 'SEND_MESSAGES')) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Missing Permissions')
                    .setDescription(`I don't have permission to send messages in ${channel}`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Check if bot can manage channels in category
            if (!botHasPermission(category, 'MANAGE_CHANNELS')) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Missing Permissions')
                    .setDescription(`I don't have permission to manage channels in ${category}`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Configure ticket system
            serverConfigManager.setTicketConfig(interaction.guildId, {
                enabled: true,
                channel: channel.id,
                category: category.id,
                modRole: modRole.id
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Ticket System Configured')
                .setDescription('The ticket system has been successfully set up')
                .addFields(
                    { name: '📢 Ticket Channel', value: `${channel}`, inline: true },
                    { name: '📁 Ticket Category', value: `${category}`, inline: true },
                    { name: '👮 Mod Role', value: `${modRole}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Post ticket button message
            const ticketEmbed = new EmbedBuilder()
                .setColor(config.colors.giveaway)
                .setTitle('🎫 Create a Support Ticket')
                .setDescription('Click the button below to create a support ticket and get help from our team');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_ticket')
                        .setLabel('🎫 Create Ticket')
                        .setStyle(ButtonStyle.Primary)
                );

            await channel.send({ embeds: [ticketEmbed], components: [row] });
            logger.success(`[${interaction.guildId}] Ticket system configured`);

        } catch (error) {
            logger.error(`Error in ticketconfig: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while configuring the ticket system');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
