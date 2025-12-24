// Warn Event Handler
// Handles bot warnings

import logger from '../utils/logger.js';

export default {
  name: 'warn',
  execute(warn, client) {
    logger.warn(`Discord.js Warning: ${warn}`);
  },
};
