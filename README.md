# 🤖 Discord Bot - Production Ready

A fully-featured, modular Discord bot built with Discord.js v14. This bot includes admin commands, music features, giveaways, role management, and much more.

## 📋 Features

### ✅ Admin & Moderation Commands
- `/ban` - Ban users with reason
- `/unban` - Unban users
- `/kick` - Kick users
- `/timeout` - Timeout users (temporary mute)
- `/untimeout` - Remove timeout
- `/purge` - Bulk delete messages
- `/lock` - Lock channels
- `/unlock` - Unlock channels
- `/slowmode` - Set channel slowmode
- `/nick` - Change user nicknames
- `/warn` - Warn users
- `/warnings` - View user warnings
- `/clearwarnings` - Clear all warnings

### 🎮 Music Commands
- `/play <query>` - Play music from YouTube
- `/pause` - Pause music
- `/resume` - Resume music
- `/skip` - Skip current song
- `/queue` - View music queue
- `/stop` - Stop music
- `/nowplaying` - Show current song

### 🎁 Giveaway Commands
- `/gstart` - Start a new giveaway
- `/gend` - End a giveaway manually
- `/greroll` - Reroll giveaway winners
- `/glist` - List active giveaways

### 👥 Role Management Commands
- `/addrole` - Add role to user
- `/removerole` - Remove role from user
- `/createrole` - Create new role
- `/deleterole` - Delete role
- `/roleinfo` - Get role information

### 🎉 Utility Commands
- `/ping` - Check bot latency
- `/uptime` - Check bot uptime
- `/serverinfo` - Server information
- `/userinfo` - User information
- `/avatar` - User avatar
- `/banner` - User banner
- `/poll` - Create polls
- `/embed` - Create custom embeds
- `/remind` - Set reminders

### 🎲 Fun Commands
- `/8ball` - Magic 8-ball
- `/coinflip` - Flip a coin
- `/roast` - Roast a user
- `/say` - Echo a message
- `/ship` - Ship two users
- `/howgay` - Check how gay someone is
- `/meme` - Random memes
- `/joke` - Random jokes

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Discord.js v14
- Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)
- Bot invited to your server with appropriate permissions

### 1. Clone/Download the Project
```bash
cd Discord Bot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:
```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
DEFAULT_PREFIX=!
MOD_LOG_CHANNEL=channel_id_here
GIVEAWAY_LOG_CHANNEL=channel_id_here
```

### 4. Get Your Discord Bot Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" section and click "Add Bot"
4. Copy the token and paste it in `.env`

### 5. Get Your IDs
- **Client ID**: Found in "General Information" section
- **Guild ID**: Right-click your server → Copy Server ID (requires Developer Mode)
- **Channel ID**: Right-click a channel → Copy Channel ID

### 6. Set Bot Permissions
In Developer Portal, go to OAuth2 → URL Generator:
- Select scopes: `bot`, `applications.commands`
- Select permissions:
  - General: `Administrator` (recommended for first setup)
  - Or manually select: BAN_MEMBERS, KICK_MEMBERS, MODERATE_MEMBERS, MANAGE_MESSAGES, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_GUILD, SEND_MESSAGES, EMBED_LINKS, ATTACH_FILES

### 7. Run the Bot
```bash
# Development mode (auto-restart with nodemon)
npm run dev

# Production mode
npm start
```

## 📂 Project Structure

```
Discord Bot/
├── src/
│   ├── index.js                    # Main bot file
│   ├── commands/
│   │   ├── admin/                  # Moderation commands
│   │   ├── role/                   # Role management commands
│   │   ├── giveaway/               # Giveaway commands
│   │   ├── music/                  # Music commands
│   │   ├── utility/                # Utility commands
│   │   ├── fun/                    # Fun commands
│   │   └── embed/                  # Embed commands
│   ├── events/
│   │   ├── ready.js                # Bot ready event
│   │   ├── interaction.js          # Command handler
│   │   ├── error.js                # Error handler
│   │   └── warn.js                 # Warning handler
│   ├── utils/
│   │   ├── cooldown.js             # Cooldown system
│   │   ├── logger.js               # Logging utility
│   │   ├── permissions.js          # Permission checks
│   │   ├── giveawayManager.js      # Giveaway data management
│   │   ├── warningManager.js       # Warning system
│   │   └── musicPlayer.js          # Music player utility
│   └── config/
│       └── config.js               # Configuration file
├── data/
│   ├── giveaways.json              # Giveaway data
│   └── warnings.json               # User warnings
├── logs/                           # Bot logs
├── package.json
├── .env                            # Environment variables (create from .env.example)
└── README.md
```

## ⚙️ Configuration

### config.js
Edit `src/config/config.js` to customize:
- Bot colors for embeds
- Cooldown duration
- Status rotation
- Data file locations

### .env File
```env
DISCORD_TOKEN=your_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
DEFAULT_PREFIX=!
MOD_LOG_CHANNEL=channel_id
GIVEAWAY_LOG_CHANNEL=channel_id
```

## 🔧 Key Features Explained

### Command Cooldowns
- Prevents command spam (default: 3 seconds)
- Customizable per command
- Stored in memory

### Permission System
- Checks user permissions before command execution
- Verifies bot has required permissions
- Role hierarchy validation

### Moderation Logging
- All mod actions logged to MOD_LOG_CHANNEL
- Includes reason, moderator, and timestamp
- Beautiful embed format

### Giveaway System
- Stores giveaways in JSON file
- Auto-end after duration
- Random winner selection
- Support for rerolls

### Warning System
- User warnings stored by guild
- Track reason and moderator
- Clear all warnings at once
- View warning history

### Music System
- Queue management
- YouTube integration via play-dl
- Voice channel handling
- Current song display

## 🚨 Error Handling

The bot includes:
- Global error handlers for unhandled rejections
- Command error logging
- Try-catch blocks in all commands
- Detailed error messages to users
- File-based logging system

## 📝 Adding New Commands

1. Create a file in the appropriate category folder:
```bash
src/commands/category/commandname.js
```

2. Follow this template:
```javascript
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import config from '../../config/config.js';
import logger from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description'),

  async execute(interaction, client) {
    try {
      // Your command code here
      await interaction.reply({ content: 'Response' });
      logger.success(`Command executed by ${interaction.user.tag}`);
    } catch (error) {
      throw new Error(`Failed: ${error.message}`);
    }
  },
};
```

## 📊 Database (Optional)

Currently uses JSON files for data storage. For larger deployments, consider adding:
- MongoDB
- SQLite
- PostgreSQL

Modify `giveawayManager.js` and `warningManager.js` to use your database.

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Keep tokens secret
2. **Use environment variables** - Don't hardcode sensitive data
3. **Validate user input** - Check all command parameters
4. **Check permissions** - Always verify before actions
5. **Rate limiting** - Built-in cooldown system
6. **Error handling** - Don't leak sensitive info in errors

## 🛠️ Troubleshooting

### Bot doesn't respond to commands
- Check bot has `applications.commands` scope
- Verify GUILD_ID is correct
- Ensure bot is in the server
- Check bot permissions

### Music not working
- Install `ffmpeg`: `npm install ffmpeg-static`
- Check voice channel permissions
- Verify bot can join voice channels

### Commands not loading
- Check syntax in command files
- Verify file structure matches directory
- Check console for error messages
- Restart bot after adding new commands

### Permissions errors
- Ensure bot role is high enough
- Check role hierarchy
- Verify bot has needed permissions
- Check channel-specific permissions

## 📦 Dependencies

- **discord.js**: Discord API library
- **@discordjs/voice**: Voice channel support
- **play-dl**: YouTube music streaming
- **axios**: HTTP requests for memes/jokes
- **dotenv**: Environment variable management

## 🎓 Learning Resources

- [Discord.js Documentation](https://discord.js.org)
- [Discord API Documentation](https://discord.com/developers/docs)
- [Slash Commands Guide](https://discord.js.org/docs/guide/interactions/slash-commands)

## 📄 License

ISC

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in `logs/` directory
3. Check Discord.js documentation
4. Verify all configuration is correct

## 🎯 Future Enhancements

Consider adding:
- Database integration
- Custom command prefix
- Reaction roles
- Auto-moderation
- XP/Level system
- Economy system
- Profile cards
- Suggestions system

---

**Happy botting! 🎉**
