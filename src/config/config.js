// Configuration file for the Discord bot
// Import environment variables from .env file
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Discord Bot Token and IDs
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  guildId: process.env.GUILD_ID || '',
  
  // Default prefix (slash commands are primary, but kept for compatibility)
  defaultPrefix: process.env.DEFAULT_PREFIX || '!',
  
  // Logging Channels
  modLogChannel: process.env.MOD_LOG_CHANNEL || '',
  giveawayLogChannel: process.env.GIVEAWAY_LOG_CHANNEL || '',
  
  // Command Cooldown (in milliseconds)
  cooldownTime: 3000,
  
  // Giveaway Settings
  giveawayDataFile: './data/giveaways.json',
  warningDataFile: './data/warnings.json',
  
  // Colors for embeds (modern palette)
  colors: {
    success: 0x2ecc71,      // Soft green
    error: 0xe74c3c,        // Soft red
    info: 0x3498db,         // Modern blue
    warning: 0xf39c12,      // Modern orange
    moderation: 0x9b59b6,   // Purple
    giveaway: 0x1abc9c,     // Teal
    primary: 0x2c3e50,      // Dark slate
    secondary: 0x95a5a6,    // Light gray
  },
  
  // Status rotation (Playing, Watching, Listening)
  statuses: [
    { name: '/help for commands', type: 'WATCHING' },
    { name: 'Discord servers', type: 'WATCHING' },
    { name: 'music with /play', type: 'LISTENING' },
    { name: 'moderation commands', type: 'WATCHING' },
  ],
};

export default config;
