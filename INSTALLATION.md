# ⚡ Complete Installation Guide

## System Requirements

- **Operating System:** Windows, macOS, or Linux
- **Node.js:** Version 18.0.0 or higher
- **npm:** Version 8.0.0 or higher (comes with Node.js)
- **Discord:** Active Discord account and server

## Step-by-Step Installation

### Step 1: Install Node.js

#### Windows
1. Go to [nodejs.org](https://nodejs.org)
2. Download LTS version
3. Run the installer
4. Click Next through all prompts
5. Verify installation:
```bash
node --version
npm --version
```

#### macOS
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Navigate to Project Folder

```bash
cd "path/to/Discord Bot"
```

Verify you're in the right place:
```bash
ls         # macOS/Linux
dir        # Windows
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Get Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" section
4. Click "Add Bot"
5. Under TOKEN, click "Copy"

### Step 5: Create .env File

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
```

### Step 6: Get Required IDs

#### CLIENT_ID
- Discord Developer Portal → General Information → Copy "Application ID"

#### GUILD_ID
- Discord: User Settings → Advanced → Developer Mode ON
- Right-click server → Copy Server ID

### Step 7: Invite Bot to Server

1. Discord Developer Portal → OAuth2 → URL Generator
2. Select: `bot` and `applications.commands`
3. Select permissions: `Administrator` (for dev)
4. Copy URL and paste in browser
5. Select server and authorize

### Step 8: Start the Bot

```bash
npm start
```

You should see: `[SUCCESS] Bot is ready!`

### Step 9: Test in Discord

Type: `/ping`

Bot should respond with latency!

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "npm: command not found" | Install Node.js from nodejs.org |
| "Invalid token" | Get fresh token from Developer Portal |
| "Bot doesn't respond" | Check bot is in server and has SendMessages permission |
| "Module not found" | Run `npm install` again |

## Next Steps

1. Read `README.md`
2. Customize `src/config/config.js`
3. Test all commands
4. Deploy to hosting service

---

**Happy botting! 🤖**
