// Warning data manager
// Handles storing and retrieving user warnings from JSON file

import fs from 'fs';

const dataFile = './data/warnings.json';

// Ensure data directory exists
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Initialize warning data file if it doesn't exist
 */
function initializeDataFile() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
  }
}

/**
 * Get all warnings for a user
 * @param {string} userId - Discord user ID
 * @param {string} guildId - Discord guild ID
 * @returns {Array} - Array of warning objects
 */
export function getUserWarnings(userId, guildId) {
  initializeDataFile();
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8') || '{}');
  const key = `${guildId}-${userId}`;
  return data[key] || [];
}

/**
 * Add warning to user
 * @param {string} userId - Discord user ID
 * @param {string} guildId - Discord guild ID
 * @param {Object} warningData - Warning data (reason, moderator, timestamp)
 * @returns {number} - Warning count for user
 */
export function addWarning(userId, guildId, warningData) {
  initializeDataFile();
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8') || '{}');
  const key = `${guildId}-${userId}`;
  
  if (!data[key]) {
    data[key] = [];
  }
  
  data[key].push({
    ...warningData,
    timestamp: Date.now(),
  });
  
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  return data[key].length;
}

/**
 * Remove warning from user
 * @param {string} userId - Discord user ID
 * @param {string} guildId - Discord guild ID
 * @param {number} index - Index of warning to remove
 * @returns {boolean} - True if successful
 */
export function removeWarning(userId, guildId, index) {
  initializeDataFile();
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8') || '{}');
  const key = `${guildId}-${userId}`;
  
  if (data[key] && data[key][index]) {
    data[key].splice(index, 1);
    
    if (data[key].length === 0) {
      delete data[key];
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  }
  
  return false;
}

/**
 * Clear all warnings for a user
 * @param {string} userId - Discord user ID
 * @param {string} guildId - Discord guild ID
 * @returns {boolean} - True if successful
 */
export function clearUserWarnings(userId, guildId) {
  initializeDataFile();
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8') || '{}');
  const key = `${guildId}-${userId}`;
  
  if (data[key]) {
    delete data[key];
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  }
  
  return false;
}

export default {
  getUserWarnings,
  addWarning,
  removeWarning,
  clearUserWarnings,
};
