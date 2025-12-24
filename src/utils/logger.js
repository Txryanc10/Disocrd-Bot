// Logger utility for console output with timestamps and colors
// Provides different log levels: info, warn, error, success, debug

import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Get formatted timestamp
 * @returns {string} - Formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString();
}

/**
 * Write log to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 */
function writeToFile(level, message) {
  const timestamp = getTimestamp();
  const logFile = path.join(logsDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  fs.appendFileSync(logFile, logMessage);
}

/**
 * Log info message
 * @param {string} message - Message to log
 */
export function info(message) {
  const timestamp = getTimestamp();
  console.log(`${colors.cyan}[${timestamp}] [INFO]${colors.reset} ${message}`);
  writeToFile('INFO', message);
}

/**
 * Log success message
 * @param {string} message - Message to log
 */
export function success(message) {
  const timestamp = getTimestamp();
  console.log(`${colors.green}[${timestamp}] [SUCCESS]${colors.reset} ${message}`);
  writeToFile('SUCCESS', message);
}

/**
 * Log warning message
 * @param {string} message - Message to log
 */
export function warn(message) {
  const timestamp = getTimestamp();
  console.log(`${colors.yellow}[${timestamp}] [WARN]${colors.reset} ${message}`);
  writeToFile('WARN', message);
}

/**
 * Log error message
 * @param {string} message - Message to log
 */
export function error(message) {
  const timestamp = getTimestamp();
  console.log(`${colors.red}[${timestamp}] [ERROR]${colors.reset} ${message}`);
  writeToFile('ERROR', message);
}

/**
 * Log debug message (only in development)
 * @param {string} message - Message to log
 */
export function debug(message) {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = getTimestamp();
    console.log(`${colors.blue}[${timestamp}] [DEBUG]${colors.reset} ${message}`);
    writeToFile('DEBUG', message);
  }
}

export default { info, success, warn, error, debug };
