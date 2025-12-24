// Main Discord Bot Entry Point
// Initializes the bot, loads commands, and sets up event listeners

import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import config from './src/config/config.js';
import logger from './src/utils/logger.js';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Discord client with intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
  ],
});

// Collections for commands and cooldowns
client.commands = new Collection();
client.commandArray = [];
client.cooldowns = new Collection();

/**
 * Load commands from the commands directory recursively
 */
async function loadCommands() {
  logger.info('Loading commands...');
  
  const commandsPath = join(__dirname, 'src', 'commands');
  const commandFiles = getFilesRecursively(commandsPath);
  
  for (const filePath of commandFiles) {
    if (!filePath.endsWith('.js')) continue;
    
    try {
      const command = await import(`file://${filePath}`);
      const commandData = command.default || command;
      
      if (commandData.data && commandData.execute) {
        client.commands.set(commandData.data.name, commandData);
        client.commandArray.push(commandData.data.toJSON());
        logger.success(`Loaded command: ${commandData.data.name}`);
      }
    } catch (error) {
      logger.error(`Error loading command from ${filePath}: ${error.message}`);
    }
  }
  
  logger.info(`Total commands loaded: ${client.commandArray.length}`);
}

/**
 * Get all files recursively from a directory
 */
function getFilesRecursively(dir) {
  let files = [];
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Load event handlers
 */
async function loadEvents() {
  logger.info('Loading events...');
  
  const eventsPath = join(__dirname, 'src', 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    try {
      const event = await import(`file://${join(eventsPath, file)}`);
      const eventData = event.default || event;
      
      if (eventData.name && eventData.execute) {
        if (eventData.once) {
          client.once(eventData.name, (...args) => eventData.execute(...args, client));
        } else {
          client.on(eventData.name, (...args) => eventData.execute(...args, client));
        }
        logger.success(`Loaded event: ${eventData.name}`);
      }
    } catch (error) {
      logger.error(`Error loading event from ${file}: ${error.message}`);
    }
  }
}

/**
 * Register slash commands to Discord
 */
async function registerCommands() {
  logger.info('Registering slash commands with Discord...');
  
  try {
    const rest = new REST({ version: '10' }).setToken(config.token);
    
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: client.commandArray,
    });
    
    logger.success(`Successfully registered ${client.commandArray.length} slash commands`);
  } catch (error) {
    logger.error(`Failed to register commands: ${error.message}`);
  }
}

/**
 * Start the bot
 */
async function main() {
  try {
    logger.info('Starting Discord bot...');
    
    // Load commands and events
    await loadCommands();
    await loadEvents();
    
    // Login to Discord
    await client.login(config.token);
    
    // Register commands after bot is ready (handled in ready event)
  } catch (error) {
    logger.error(`Failed to start bot: ${error.message}`);
    process.exit(1);
  }
}

// Global error handlers
process.on('unhandledRejection', error => {
  logger.error(`Unhandled Promise Rejection: ${error.message}`);
  logger.error(error.stack);
});

process.on('uncaughtException', error => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack);
  // Restart the process
  process.exit(1);
});

// Export client for use in other files
export { client, registerCommands };

// Start the bot
main();
