// Cooldown handler to prevent spam
// Stores user cooldowns for each command

const cooldowns = new Map();

/**
 * Get the cooldown status for a user on a specific command
 * @param {string} userId - Discord user ID
 * @param {string} commandName - Name of the command
 * @param {number} cooldownTime - Cooldown duration in milliseconds
 * @returns {boolean} - True if user is on cooldown, false otherwise
 */
export function isOnCooldown(userId, commandName, cooldownTime) {
  const key = `${userId}-${commandName}`;
  
  if (cooldowns.has(key)) {
    const expirationTime = cooldowns.get(key);
    if (Date.now() < expirationTime) {
      return true;
    }
    cooldowns.delete(key);
  }
  
  return false;
}

/**
 * Set a cooldown for a user on a specific command
 * @param {string} userId - Discord user ID
 * @param {string} commandName - Name of the command
 * @param {number} cooldownTime - Cooldown duration in milliseconds
 */
export function setCooldown(userId, commandName, cooldownTime) {
  const key = `${userId}-${commandName}`;
  cooldowns.set(key, Date.now() + cooldownTime);
}

/**
 * Get remaining cooldown time in milliseconds
 * @param {string} userId - Discord user ID
 * @param {string} commandName - Name of the command
 * @returns {number} - Remaining cooldown time in ms
 */
export function getRemainingCooldown(userId, commandName) {
  const key = `${userId}-${commandName}`;
  if (cooldowns.has(key)) {
    const remaining = cooldowns.get(key) - Date.now();
    return Math.max(0, remaining);
  }
  return 0;
}

/**
 * Clear all cooldowns (useful for admin commands)
 */
export function clearAllCooldowns() {
  cooldowns.clear();
}

export default { isOnCooldown, setCooldown, getRemainingCooldown, clearAllCooldowns };
