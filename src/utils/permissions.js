// Permission checking utility
// Validates if a user has required permissions for moderation commands

import { PermissionFlagsBits } from 'discord.js';

/**
 * Check if user has required permission
 * @param {GuildMember} member - Discord guild member
 * @param {string} permission - Permission to check (e.g., 'BAN_MEMBERS')
 * @returns {boolean} - True if user has permission, false otherwise
 */
export function hasPermission(member, permission) {
  if (!member) return false;
  if (member.user.id === member.guild.ownerId) return true; // Owner always has permission
  return member.permissions.has(PermissionFlagsBits[permission]) || false;
}

/**
 * Check if bot has required permission
 * @param {GuildMember} botMember - Bot's guild member object
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if bot has permission, false otherwise
 */
export function botHasPermission(botMember, permission) {
  if (!botMember) return false;
  return botMember.permissions.has(PermissionFlagsBits[permission]) || false;
}

/**
 * Check if user can interact with a target member (role hierarchy)
 * @param {GuildMember} executor - User executing the command
 * @param {GuildMember} target - User being targeted
 * @returns {boolean} - True if executor can interact with target, false otherwise
 */
export function canInteract(executor, target) {
  if (!executor || !target) return false;
  if (executor.user.id === executor.guild.ownerId) return true; // Owner can always interact
  if (target.user.id === target.guild.ownerId) return false; // Cannot interact with owner
  return executor.roles.highest.position > target.roles.highest.position;
}

/**
 * Check if bot can interact with target member
 * @param {GuildMember} botMember - Bot's guild member object
 * @param {GuildMember} target - User being targeted
 * @returns {boolean} - True if bot can interact with target, false otherwise
 */
export function botCanInteract(botMember, target) {
  if (!botMember || !target) return false;
  if (target.user.id === target.guild.ownerId) return false; // Cannot interact with owner
  return botMember.roles.highest.position > target.roles.highest.position;
}

export default {
  hasPermission,
  botHasPermission,
  canInteract,
  botCanInteract,
};
