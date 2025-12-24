# 🚀 Quick Start Guide

## 30-Second Setup

### 1. Get Your Bot Token
Visit [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new application
- Go to Bot section
- Copy the token

### 2. Create .env File
Create `.env` in the root folder:
```
DISCORD_TOKEN=paste_your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_server_id
```

### 3. Install & Run
```bash
npm install
npm start
```

## Getting Your IDs

### Bot Token
1. Discord Developer Portal → Your App → Bot
2. Click "Reset Token" → Copy

### Client ID
1. Discord Developer Portal → General Information
2. Copy "Application ID"

### Guild/Server ID
1. Enable Developer Mode: User Settings → Advanced → Developer Mode
2. Right-click server name → Copy Server ID

### Channel ID (for logging)
1. Right-click channel → Copy Channel ID
2. Add to .env as MOD_LOG_CHANNEL

## Bot Permissions

The bot needs these permissions in your server:

**Text Channel Permissions:**
- Send Messages
- Embed Links
- Attach Files
- Manage Messages
- Read Message History

**User Permissions:**
- Ban Members
- Kick Members
- Timeout Members
- Manage Nicknames
- Manage Roles
- Manage Channels

**General Permissions:**
- View Channels
- Connect (Voice)
- Speak (Voice)

## First Run Checklist

- [ ] Token added to .env
- [ ] Client ID added to .env
- [ ] Guild ID added to .env
- [ ] Bot invited to server
- [ ] Bot has required permissions
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Check console for "Bot is ready!"

## Testing Commands

Try these commands in Discord:
```
/ping              - Should show latency
/serverinfo        - Shows server info
/8ball question    - Magic 8-ball test
/help              - View all commands
```

## Common Issues

**Bot doesn't respond:**
- Check token is correct
- Verify bot is in server
- Ensure bot has SendMessages permission

**Command shows "Unknown command":**
- Bot needs `applications.commands` scope
- Restart bot after adding commands

**Music not working:**
- Run: `npm install ffmpeg-static`
- Check bot can join voice channels

## Need Help?

1. Check logs in `logs/` folder
2. Verify .env file format
3. Read README.md for detailed info
4. Check Discord.js documentation

---

**Happy botting! 🎉**
