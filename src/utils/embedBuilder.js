// Modern Embed Builder Utility
// Provides consistent, clean embed styling across all commands

import { EmbedBuilder } from 'discord.js';
import config from '../config/config.js';

/**
 * Create a success embed with modern styling
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @param {Object} options - Additional options
 * @returns {EmbedBuilder}
 */
export function successEmbed(title, description, options = {}) {
  const embed = new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle(`✅ ${title}`)
    .setDescription(description || '');

  if (options.fields) {
    embed.addFields(options.fields);
  }

  if (options.footer !== false) {
    embed.setFooter({ text: options.footer || 'Success' });
  }

  if (options.timestamp !== false) {
    embed.setTimestamp();
  }

  return embed;
}

/**
 * Create an error embed with modern styling
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @param {Object} options - Additional options
 * @returns {EmbedBuilder}
 */
export function errorEmbed(title, description, options = {}) {
  const embed = new EmbedBuilder()
    .setColor(config.colors.error)
    .setTitle(`❌ ${title}`)
    .setDescription(description || '');

  if (options.fields) {
    embed.addFields(options.fields);
  }

  if (options.footer !== false) {
    embed.setFooter({ text: options.footer || 'Error' });
  }

  if (options.timestamp !== false) {
    embed.setTimestamp();
  }

  return embed;
}

/**
 * Create an info embed with modern styling
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @param {Object} options - Additional options
 * @returns {EmbedBuilder}
 */
export function infoEmbed(title, description, options = {}) {
  const embed = new EmbedBuilder()
    .setColor(config.colors.info)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description || '');

  if (options.fields) {
    embed.addFields(options.fields);
  }

  if (options.thumbnail) {
    embed.setThumbnail(options.thumbnail);
  }

  if (options.footer !== false) {
    embed.setFooter({ text: options.footer || 'Info' });
  }

  if (options.timestamp !== false) {
    embed.setTimestamp();
  }

  return embed;
}

/**
 * Create a warning embed with modern styling
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @param {Object} options - Additional options
 * @returns {EmbedBuilder}
 */
export function warningEmbed(title, description, options = {}) {
  const embed = new EmbedBuilder()
    .setColor(config.colors.warning)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description || '');

  if (options.fields) {
    embed.addFields(options.fields);
  }

  if (options.footer !== false) {
    embed.setFooter({ text: options.footer || 'Warning' });
  }

  if (options.timestamp !== false) {
    embed.setTimestamp();
  }

  return embed;
}

/**
 * Create a custom styled embed
 * @param {Object} options - Embed options
 * @returns {EmbedBuilder}
 */
export function customEmbed(options = {}) {
  const embed = new EmbedBuilder()
    .setColor(options.color || config.colors.primary);

  if (options.title) {
    embed.setTitle(options.title);
  }

  if (options.description) {
    embed.setDescription(options.description);
  }

  if (options.fields) {
    embed.addFields(options.fields);
  }

  if (options.thumbnail) {
    embed.setThumbnail(options.thumbnail);
  }

  if (options.image) {
    embed.setImage(options.image);
  }

  if (options.author) {
    embed.setAuthor(options.author);
  }

  if (options.footer !== false) {
    embed.setFooter(options.footer || { text: 'Discord Bot' });
  }

  if (options.timestamp !== false) {
    embed.setTimestamp();
  }

  return embed;
}

export default {
  successEmbed,
  errorEmbed,
  infoEmbed,
  warningEmbed,
  customEmbed,
};
