/**
 * Server Config Manager (ES6 Module)
 * Handles per-server configuration (log channels, ticket settings, etc.)
 * 
 * Usage:
 * const config = serverConfigManager.getServerConfig(guildId);
 * serverConfigManager.setLogChannel(guildId, channelId);
 * serverConfigManager.setTicketConfig(guildId, config);
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, '../..', 'data', 'serverConfig.json');

class ServerConfigManager {
    constructor() {
        this.configs = this.loadConfigs();
    }

    /**
     * Load all server configs from file
     */
    loadConfigs() {
        try {
            if (fs.existsSync(CONFIG_FILE)) {
                const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            logger.warn(`Error loading server configs: ${error.message}`);
        }
        return {};
    }

    /**
     * Save configs to file
     */
    saveConfigs() {
        try {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.configs, null, 2));
        } catch (error) {
            logger.error(`Error saving server configs: ${error.message}`);
        }
    }

    /**
     * Get full config for a server
     */
    getServerConfig(guildId) {
        return this.configs[guildId] || this.createDefaultConfig(guildId);
    }

    /**
     * Create default config for new server
     */
    createDefaultConfig(guildId) {
        return {
            guildId: guildId,
            logChannel: null,
            ticketEnabled: false,
            ticketChannel: null,
            ticketCategoryId: null,
            ticketModRoleId: null,
            ticketNextId: 1,
            roleRequestEnabled: false,
            roleRequestChannel: null,
            roleRequestUseDM: false,
            roleRequestApproverRoleId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    /**
     * Get log channel for a server
     */
    getLogChannel(guildId) {
        const config = this.getServerConfig(guildId);
        return config.logChannel;
    }

    /**
     * Set log channel for a server
     */
    setLogChannel(guildId, channelId) {
        if (!this.configs[guildId]) {
            this.configs[guildId] = this.createDefaultConfig(guildId);
        }
        this.configs[guildId].logChannel = channelId;
        this.configs[guildId].updatedAt = new Date().toISOString();
        this.saveConfigs();
        logger.success(`Set log channel for ${guildId} to ${channelId}`);
        return true;
    }

    /**
     * Remove log channel for a server
     */
    removeLogChannel(guildId) {
        if (this.configs[guildId]) {
            this.configs[guildId].logChannel = null;
            this.configs[guildId].updatedAt = new Date().toISOString();
            this.saveConfigs();
            logger.success(`Removed log channel for ${guildId}`);
            return true;
        }
        return false;
    }

    /**
     * Get ticket config for a server
     */
    getTicketConfig(guildId) {
        const config = this.getServerConfig(guildId);
        return {
            enabled: config.ticketEnabled,
            channel: config.ticketChannel,
            category: config.ticketCategoryId,
            modRole: config.ticketModRoleId,
            nextId: config.ticketNextId
        };
    }

    /**
     * Set ticket settings for a server
     */
    setTicketConfig(guildId, settings) {
        if (!this.configs[guildId]) {
            this.configs[guildId] = this.createDefaultConfig(guildId);
        }

        if (settings.enabled !== undefined) this.configs[guildId].ticketEnabled = settings.enabled;
        if (settings.channel !== undefined) this.configs[guildId].ticketChannel = settings.channel;
        if (settings.category !== undefined) this.configs[guildId].ticketCategoryId = settings.category;
        if (settings.modRole !== undefined) this.configs[guildId].ticketModRoleId = settings.modRole;

        this.configs[guildId].updatedAt = new Date().toISOString();
        this.saveConfigs();
        logger.success(`Updated ticket config for ${guildId}`);
        return true;
    }

    /**
     * Get next ticket ID and increment
     */
    getNextTicketId(guildId) {
        if (!this.configs[guildId]) {
            this.configs[guildId] = this.createDefaultConfig(guildId);
        }
        const nextId = this.configs[guildId].ticketNextId;
        this.configs[guildId].ticketNextId++;
        this.saveConfigs();
        return nextId;
    }

    /**
     * Get all server configs (for analytics/admin)
     */
    getAllConfigs() {
        return this.configs;
    }

    /**
     * Delete server config (when bot leaves)
     */
    deleteServerConfig(guildId) {
        if (this.configs[guildId]) {
            delete this.configs[guildId];
            this.saveConfigs();
            logger.success(`Deleted config for ${guildId}`);
            return true;
        }
        return false;
    }
}

const serverConfigManager = new ServerConfigManager();
export default serverConfigManager;
