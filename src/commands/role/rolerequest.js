/**
 * Request Role Command
 * Users can request to join a role that requires approval
 * 
 * Usage: /rolerequest <role>
 * 
 * Required Permissions: None (any user)
 */

import { SlashCommandBuilder } from 'discord.js';
import roleRequestManager from '../../utils/roleRequestManager.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import { successEmbed, errorEmbed, infoEmbed } from '../../utils/embedBuilder.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rolerequest')
        .setDescription('Request to be given a role')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role you want to request')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');
            const guildConfig = serverConfigManager.getServerConfig(interaction.guildId);

            // Check if role request system is configured
            if (!guildConfig.roleRequestEnabled) {
                return interaction.reply({ 
                    embeds: [errorEmbed('System Disabled', 'Role requests are not enabled on this server')] , 
                    ephemeral: true 
                });
            }

            // Create the request
            const result = roleRequestManager.createRequest(
                interaction.guildId,
                interaction.user.id,
                role.id,
                interaction.user.username,
                role.name
            );

            if (!result.success) {
                return interaction.reply({ 
                    embeds: [errorEmbed('Request Failed', result.message)] , 
                    ephemeral: true 
                });
            }

            const embed = successEmbed('Request Submitted', `Your request for **${role.name}** is pending approval`, {
                fields: [
                    { name: 'Role', value: `${role}`, inline: true },
                    { name: 'Expires', value: '7 days', inline: true }
                ],
                footer: 'Request pending'
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Send notification to approvers
            if (guildConfig.roleRequestChannel) {
                try {
                    const channel = await interaction.client.channels.fetch(guildConfig.roleRequestChannel);
                    
                    const notifEmbed = infoEmbed('New Role Request', `${interaction.user} requested **${role.name}**`, {
                        fields: [
                            { name: 'User', value: `${interaction.user}`, inline: true },
                            { name: 'Role', value: `${role}`, inline: true }
                        ],
                        footer: 'Pending approval'
                    });

                    await channel.send({ embeds: [notifEmbed] });
                } catch (error) {
                    logger.warn(`Could not send role request notification: ${error.message}`);
                }
            }

            // Send DM to approvers if configured
            if (guildConfig.roleRequestUseDM && guildConfig.roleRequestApproverRoleId) {
                try {
                    const guild = await interaction.client.guilds.fetch(interaction.guildId);
                    const members = await guild.members.fetch();
                    const approvers = members.filter(m => 
                        m.roles.cache.has(guildConfig.roleRequestApproverRoleId)
                    );

                    const dmEmbed = infoEmbed('New Request', `${interaction.user.username} wants **${role.name}**`, {
                        fields: [
                            { name: 'User', value: `${interaction.user.username}`, inline: true },
                            { name: 'User ID', value: interaction.user.id, inline: true }
                        ],
                        footer: 'Use /roleapprove or /roledeny'
                    });

                    for (const [, member] of approvers) {
                        try {
                            await member.send({ embeds: [dmEmbed] });
                        } catch (dmError) {
                            logger.warn(`Could not DM approver: ${dmError.message}`);
                        }
                    }
                } catch (error) {
                    logger.warn(`Could not send DM notifications: ${error.message}`);
                }
            }

            logger.success(`[${interaction.guildId}] Role request created by ${interaction.user.tag} for ${role.name}`);

        } catch (error) {
            logger.error(`Error in rolerequest: ${error.message}`);
            interaction.reply({ 
                embeds: [errorEmbed('Error', 'Failed to submit your request')], 
                ephemeral: true 
            });
        }
    }
};
