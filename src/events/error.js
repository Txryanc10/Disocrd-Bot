// Error Event Handler
// Handles bot errors and warnings

import logger from '../utils/logger.js';

export default {
  name: 'error',
  execute(error, client) {
    logger.error(`Discord.js Error: ${error.message}`);
    logger.error(error.stack);
  },
};
