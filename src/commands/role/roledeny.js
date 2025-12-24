/**
 * Deny Role Request Command
 * Approvers can deny pending role requests
 * 
 * Usage: /roledeny <user> <role> <reason>
 * 
 * Required Permissions: Approver role (configured by admin)
 */

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import roleRequestManager from '../../utils/roleRequestManager.js';
import serverConfigManager from '../../utils/serverConfigManager.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roledeny')
        .setDescription('Deny a pending role request')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user who requested the role')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role that was requested')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for denying the request')
                .setRequired(false)
                .setMaxLength(100)
        ),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
            const reason = interaction.options.getString('reason') || 'No reason provided';
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

            // Get the request
            const request = roleRequestManager.getRequest(interaction.guildId, user.id, role.id);

            if (!request) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Request Not Found')
                    .setDescription(`No pending request found for ${user} for the ${role} role`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (request.status !== 'pending') {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Invalid Request')
                    .setDescription(`This request has already been ${request.status}`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Deny the request
            roleRequestManager.denyRequest(interaction.guildId, user.id, role.id, reason);

            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle('✅ Request Denied')
                .setDescription(`Role request from ${user} has been denied`)
                .addFields(
                    { name: 'User', value: `${user}`, inline: true },
                    { name: 'Role', value: `${role}`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Send DM to user
            try {
                const dmEmbed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('❌ Role Request Denied')
                    .setDescription(`Your request for the **${role.name}** role in **${interaction.guild.name}** has been denied`)
                    .addFields(
                        { name: 'Server', value: interaction.guild.name, inline: true },
                        { name: 'Role', value: role.name, inline: true },
                        { name: 'Reason', value: reason, inline: false }
                    )
                    .setTimestamp();

                await user.send({ embeds: [dmEmbed] });
            } catch (error) {
                logger.warn(`Could not DM user about denial: ${error.message}`);
            }

            logger.success(`[${interaction.guildId}] Role request denied: ${user.tag} -> ${role.name}`);

        } catch (error) {
            logger.error(`Error in roledeny: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while denying the request');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
