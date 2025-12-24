// Ready Event Handler
// Fires when bot successfully connects to Discord

import logger from '../utils/logger.js';
import config from '../config/config.js';
import { registerCommands } from '../index.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.success(`✓ Bot logged in as: ${client.user.tag}`);
    logger.success(`✓ Bot ID: ${client.user.id}`);
    logger.info(`✓ Serving ${client.guilds.cache.size} guild(s)`);
    
    // Register slash commands
    await registerCommands();
    
    // Set status rotation
    let statusIndex = 0;
    setInterval(() => {
      const status = config.statuses[statusIndex];
      client.user.setActivity(status.name, { type: status.type });
      statusIndex = (statusIndex + 1) % config.statuses.length;
    }, 10000); // Change status every 10 seconds
    
    logger.success('Bot is ready!');
  },
};
