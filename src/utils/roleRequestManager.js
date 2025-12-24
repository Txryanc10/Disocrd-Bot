/**
 * Role Request Manager (ES6 Module)
 * Handles role request system with approval workflow
 * 
 * Usage:
 * const requests = roleRequestManager.getPendingRequests(guildId);
 * roleRequestManager.createRequest(guildId, userId, roleId);
 * roleRequestManager.approveRequest(guildId, userId, roleId);
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUESTS_FILE = path.join(__dirname, '../..', 'data', 'roleRequests.json');

class RoleRequestManager {
    constructor() {
        this.requests = this.loadRequests();
    }

    /**
     * Load all role requests from file
     */
    loadRequests() {
        try {
            if (fs.existsSync(REQUESTS_FILE)) {
                const data = fs.readFileSync(REQUESTS_FILE, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            logger.warn(`Error loading role requests: ${error.message}`);
        }
        return {};
    }

    /**
     * Save requests to file
     */
    saveRequests() {
        try {
            fs.writeFileSync(REQUESTS_FILE, JSON.stringify(this.requests, null, 2));
        } catch (error) {
            logger.error(`Error saving role requests: ${error.message}`);
        }
    }

    /**
     * Create a new role request
     */
    createRequest(guildId, userId, roleId, userName, roleName) {
        if (!this.requests[guildId]) {
            this.requests[guildId] = {};
        }

        const requestKey = `${userId}_${roleId}`;

        // Check if request already exists
        if (this.requests[guildId][requestKey]) {
            return { success: false, message: 'Request already pending' };
        }

        this.requests[guildId][requestKey] = {
            userId,
            roleId,
            userName,
            roleName,
            status: 'pending',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };

        this.saveRequests();
        logger.success(`[${guildId}] Role request created: ${userName} -> ${roleName}`);
        return { success: true, message: 'Request created' };
    }

    /**
     * Get all pending requests for a guild
     */
    getPendingRequests(guildId) {
        if (!this.requests[guildId]) {
            return [];
        }

        return Object.values(this.requests[guildId])
            .filter(req => req.status === 'pending')
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    /**
     * Get pending request for specific user and role
     */
    getRequest(guildId, userId, roleId) {
        if (!this.requests[guildId]) {
            return null;
        }

        const requestKey = `${userId}_${roleId}`;
        return this.requests[guildId][requestKey] || null;
    }

    /**
     * Approve a role request
     */
    approveRequest(guildId, userId, roleId) {
        if (!this.requests[guildId]) {
            return { success: false, message: 'No requests for this guild' };
        }

        const requestKey = `${userId}_${roleId}`;
        const request = this.requests[guildId][requestKey];

        if (!request) {
            return { success: false, message: 'Request not found' };
        }

        if (request.status !== 'pending') {
            return { success: false, message: `Request already ${request.status}` };
        }

        request.status = 'approved';
        request.approvedAt = new Date().toISOString();
        this.saveRequests();

        logger.success(`[${guildId}] Role request approved: ${request.userName} -> ${request.roleName}`);
        return { success: true, message: 'Request approved' };
    }

    /**
     * Deny a role request
     */
    denyRequest(guildId, userId, roleId, reason = 'No reason provided') {
        if (!this.requests[guildId]) {
            return { success: false, message: 'No requests for this guild' };
        }

        const requestKey = `${userId}_${roleId}`;
        const request = this.requests[guildId][requestKey];

        if (!request) {
            return { success: false, message: 'Request not found' };
        }

        if (request.status !== 'pending') {
            return { success: false, message: `Request already ${request.status}` };
        }

        request.status = 'denied';
        request.deniedAt = new Date().toISOString();
        request.denyReason = reason;
        this.saveRequests();

        logger.success(`[${guildId}] Role request denied: ${request.userName} -> ${request.roleName}`);
        return { success: true, message: 'Request denied' };
    }

    /**
     * Delete a request (cleanup)
     */
    deleteRequest(guildId, userId, roleId) {
        if (!this.requests[guildId]) {
            return false;
        }

        const requestKey = `${userId}_${roleId}`;
        if (this.requests[guildId][requestKey]) {
            delete this.requests[guildId][requestKey];
            this.saveRequests();
            return true;
        }

        return false;
    }

    /**
     * Clear expired requests (older than 7 days)
     */
    clearExpiredRequests(guildId) {
        if (!this.requests[guildId]) {
            return 0;
        }

        const now = Date.now();
        let count = 0;

        for (const [key, request] of Object.entries(this.requests[guildId])) {
            const expiryTime = new Date(request.expiresAt).getTime();
            if (now > expiryTime) {
                delete this.requests[guildId][key];
                count++;
            }
        }

        if (count > 0) {
            this.saveRequests();
        }

        return count;
    }

    /**
     * Get all requests (pending and processed)
     */
    getAllRequests(guildId) {
        return this.requests[guildId] ? Object.values(this.requests[guildId]) : [];
    }
}

const roleRequestManager = new RoleRequestManager();
export default roleRequestManager;
