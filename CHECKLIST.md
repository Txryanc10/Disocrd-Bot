# 🔍 Setup Verification Checklist

## Pre-Installation

- [ ] Node.js 18 or higher installed
  ```bash
  node --version  # Should show v18.0.0 or higher
  ```

- [ ] npm installed
  ```bash
  npm --version   # Should show npm version
  ```

## Installation Steps

- [ ] Dependencies installed
  ```bash
  npm install     # Run this first
  ```

- [ ] All node_modules present
  ```bash
  ls node_modules # Check if folder exists
  ```

## Configuration

- [ ] `.env` file created
  ```bash
  cp .env.example .env
  ```

- [ ] `DISCORD_TOKEN` added to .env
  - Token obtained from Discord Developer Portal
  - Not a dummy/placeholder value

- [ ] `CLIENT_ID` added to .env
  - Application ID from Developer Portal
  - Correct format (18-20 digits)

- [ ] `GUILD_ID` added to .env
  - Your server/guild ID
  - Obtained with Developer Mode enabled

- [ ] `MOD_LOG_CHANNEL` added (optional)
  - Channel ID where mod actions are logged
  - Bot can send messages to this channel

## Discord Bot Setup

- [ ] Bot created in Developer Portal
  - Application created
  - Bot user added to application

- [ ] Bot token is valid and current
  - Token is not expired
  - Token has not been reset

- [ ] Bot invited to server
  - OAuth2 URL generated with correct scopes:
    - `bot`
    - `applications.commands`
  
- [ ] Correct permissions selected
  - Minimal: `SendMessages`, `EmbedLinks`, `ManageMessages`
  - Recommended: `Administrator` (for development)

- [ ] Bot appears in server member list
  - Guild ID matches your server
  - Bot is not hidden/invisible

## Folder Structure

- [ ] `src/` folder exists with:
  - [ ] `index.js` (main file)
  - [ ] `config/config.js`
  - [ ] `commands/` folder with subfolders
  - [ ] `events/` folder
  - [ ] `utils/` folder

- [ ] `data/` folder exists with:
  - [ ] `giveaways.json`
  - [ ] `warnings.json`

- [ ] Root files present:
  - [ ] `package.json`
  - [ ] `.env`
  - [ ] `.gitignore`
  - [ ] `README.md`

## File Completeness

- [ ] All command files exist (63 total)
  - [ ] Admin commands: 12 files
  - [ ] Role commands: 5 files
  - [ ] Giveaway commands: 4 files
  - [ ] Music commands: 7 files
  - [ ] Utility commands: 9 files
  - [ ] Fun commands: 8 files
  - [ ] Embed commands: 1 file

- [ ] All utility files present
  - [ ] `cooldown.js`
  - [ ] `logger.js`
  - [ ] `permissions.js`
  - [ ] `giveawayManager.js`
  - [ ] `warningManager.js`
  - [ ] `musicPlayer.js`

- [ ] All event files present
  - [ ] `ready.js`
  - [ ] `interaction.js`
  - [ ] `error.js`
  - [ ] `warn.js`

## Starting the Bot

- [ ] Run the bot:
  ```bash
  npm start
  ```

- [ ] Look for these messages in console:
  - `[INFO] Loading commands...`
  - `[INFO] Loading events...`
  - `[SUCCESS] Loaded event: ready`
  - `[SUCCESS] ✓ Bot logged in as: YourBotName#0000`
  - `[SUCCESS] Bot is ready!`

- [ ] No error messages in console
  - No "Cannot find module" errors
  - No syntax errors
  - No permission denied errors

## Bot Functionality

- [ ] Try `/ping` command
  - Bot responds with latency
  - Shows API latency

- [ ] Try `/serverinfo` command
  - Bot returns server information
  - Embed displays correctly

- [ ] Try `/8ball test` command
  - Bot responds with random answer
  - Command works in text channels

- [ ] Check `/help` or command list
  - All commands appear in autocomplete
  - Commands show descriptions

## Permissions Verification

- [ ] Check bot's highest role position
  - In Discord, check Server Settings → Roles
  - Bot role is visible
  - Bot role is high enough for moderation

- [ ] Test mod command (if permissions allow)
  - Try `/nick` on yourself or someone
  - Bot can change nicknames
  - Logging appears in console

## Data Files

- [ ] `data/giveaways.json` is valid JSON
  ```bash
  cat data/giveaways.json  # Should show: []
  ```

- [ ] `data/warnings.json` is valid JSON
  ```bash
  cat data/warnings.json   # Should show: {}
  ```

- [ ] Data files are writable
  - Bot can write to these files
  - No permission denied errors

## Logging

- [ ] `logs/` folder created automatically
  - Check if folder exists after first run
  - Log files are being created
  - No permission errors for writing logs

- [ ] Log file contains entries
  - Contains bot startup messages
  - Contains command execution logs
  - Timestamped entries

## Development Mode (Optional)

- [ ] nodemon installed for dev mode
  ```bash
  npm list nodemon
  ```

- [ ] `npm run dev` works
  - Bot restarts on file changes
  - Useful for development

## Production Checklist

- [ ] TOKEN never committed to git
  - Check `.gitignore` includes `.env`
  - Run `git status` to verify

- [ ] Error messages don't expose sensitive info
  - No tokens in error messages
  - No file paths in responses

- [ ] Bot has error handlers
  - `uncaughtException` handler present
  - `unhandledRejection` handler present
  - Bot doesn't crash on errors

- [ ] Cooldown system working
  - Try spamming a command
  - Gets "on cooldown" message

## Performance

- [ ] Bot loads all commands
  - Count in console matches file count
  - No missing command warnings

- [ ] Bot's memory usage is reasonable
  - Check Task Manager
  - Not continuously growing
  - No memory leaks apparent

- [ ] Response times are fast
  - Commands respond within 1-2 seconds
  - No lag in slash command autocomplete

## Final Verification

Run this command to test everything:
```bash
npm start
```

Expected output:
```
[TIMESTAMP] [INFO] Loading commands...
[TIMESTAMP] [SUCCESS] Loaded command: ping
[TIMESTAMP] [SUCCESS] Loaded command: kick
... (more commands) ...
[TIMESTAMP] [INFO] Loading events...
[TIMESTAMP] [SUCCESS] Loaded event: ready
... (more events) ...
[TIMESTAMP] [SUCCESS] ✓ Bot logged in as: YourBotName#0000
[TIMESTAMP] [SUCCESS] ✓ Bot ID: 123456789000000000
[TIMESTAMP] [INFO] ✓ Serving 1 guild(s)
[TIMESTAMP] [SUCCESS] Successfully registered 63 slash commands
[TIMESTAMP] [SUCCESS] Bot is ready!
```

If you see all these messages, your bot is ready to use! 🎉

---

## Troubleshooting Failed Checks

| Failed Check | Solution |
|---|---|
| Token invalid | Get new token from Developer Portal |
| Bot not in server | Regenerate OAuth2 URL and invite |
| Commands not loading | Check file syntax, restart bot |
| No perms to send messages | Check channel-specific permissions |
| Bot doesn't respond | Verify bot is in server, has permissions |
| Errors in console | Check error message, read README |
| .env not loading | Ensure file is named exactly `.env` |

---

✅ **All checks passed? Your bot is production-ready!**
