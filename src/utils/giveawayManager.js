// Giveaway data manager
// Handles storing and retrieving giveaway data from JSON file

import fs from 'fs';
import path from 'path';

const dataFile = './data/giveaways.json';

// Ensure data directory exists
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Initialize giveaway data file if it doesn't exist
 */
function initializeDataFile() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
  }
}

/**
 * Read all giveaways from file
 * @returns {Array} - Array of giveaway objects
 */
export function getAllGiveaways() {
  initializeDataFile();
  const data = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(data || '[]');
}

/**
 * Get giveaway by message ID
 * @param {string} messageId - Discord message ID
 * @returns {Object|null} - Giveaway object or null if not found
 */
export function getGiveaway(messageId) {
  const giveaways = getAllGiveaways();
  return giveaways.find(g => g.messageId === messageId) || null;
}

/**
 * Create new giveaway
 * @param {Object} giveawayData - Giveaway data object
 * @returns {boolean} - True if successful
 */
export function createGiveaway(giveawayData) {
  const giveaways = getAllGiveaways();
  giveaways.push(giveawayData);
  fs.writeFileSync(dataFile, JSON.stringify(giveaways, null, 2));
  return true;
}

/**
 * Update giveaway
 * @param {string} messageId - Discord message ID
 * @param {Object} updates - Data to update
 * @returns {boolean} - True if successful
 */
export function updateGiveaway(messageId, updates) {
  let giveaways = getAllGiveaways();
  giveaways = giveaways.map(g =>
    g.messageId === messageId ? { ...g, ...updates } : g
  );
  fs.writeFileSync(dataFile, JSON.stringify(giveaways, null, 2));
  return true;
}

/**
 * Delete giveaway
 * @param {string} messageId - Discord message ID
 * @returns {boolean} - True if successful
 */
export function deleteGiveaway(messageId) {
  let giveaways = getAllGiveaways();
  giveaways = giveaways.filter(g => g.messageId !== messageId);
  fs.writeFileSync(dataFile, JSON.stringify(giveaways, null, 2));
  return true;
}

/**
 * Get active giveaways (not ended)
 * @returns {Array} - Array of active giveaway objects
 */
export function getActiveGiveaways() {
  const giveaways = getAllGiveaways();
  return giveaways.filter(g => !g.ended);
}

export default {
  getAllGiveaways,
  getGiveaway,
  createGiveaway,
  updateGiveaway,
  deleteGiveaway,
  getActiveGiveaways,
};
