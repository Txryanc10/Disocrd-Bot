/**
 * Approve Role Request Command
 * Approvers can approve pending role requests
 * 
 * Usage: /roleapprove <user> <role>
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
        .setName('roleapprove')
        .setDescription('Approve a pending role request')
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
        ),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const role = interaction.options.getRole('role');
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

            // Approve the request
            roleRequestManager.approveRequest(interaction.guildId, user.id, role.id);

            // Try to give the role
            try {
                const targetMember = await interaction.guild.members.fetch(user.id);
                await targetMember.roles.add(role);

                const embed = new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setTitle('✅ Request Approved & Role Given')
                    .setDescription(`${user} has been given the ${role} role`)
                    .addFields(
                        { name: 'User', value: `${user}`, inline: true },
                        { name: 'Role', value: `${role}`, inline: true },
                        { name: 'Approved By', value: `${interaction.user}`, inline: true }
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });

                // Send DM to user
                try {
                    const dmEmbed = new EmbedBuilder()
                        .setColor(config.colors.success)
                        .setTitle('✅ Role Request Approved')
                        .setDescription(`Your request for the **${role.name}** role in **${interaction.guild.name}** has been approved!`)
                        .addFields(
                            { name: 'Server', value: interaction.guild.name, inline: true },
                            { name: 'Role', value: role.name, inline: true }
                        )
                        .setTimestamp();

                    await user.send({ embeds: [dmEmbed] });
                } catch (error) {
                    logger.warn(`Could not DM user about approval: ${error.message}`);
                }

                logger.success(`[${interaction.guildId}] Role request approved: ${user.tag} -> ${role.name}`);

            } catch (roleError) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('⚠️ Request Approved But Role Not Given')
                    .setDescription('The request was approved but the bot could not give the role')
                    .addFields(
                        { name: 'Reason', value: roleError.message.substring(0, 100), inline: false }
                    );

                await interaction.reply({ embeds: [embed], ephemeral: true });
                logger.error(`Could not give role: ${roleError.message}`);
            }

        } catch (error) {
            logger.error(`Error in roleapprove: ${error.message}`);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Error')
                .setDescription('An error occurred while approving the request');
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
