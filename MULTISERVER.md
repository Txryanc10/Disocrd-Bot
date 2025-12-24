# 🌍 Multi-Server Setup & Ticket System Guide

**Complete Guide to Per-Server Configuration and Ticket System**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Server Configuration](#server-configuration)
3. [Ticket System](#ticket-system)
4. [New Commands](#new-commands)
5. [Setup Instructions](#setup-instructions)
6. [How It Works](#how-it-works)
7. [FAQ](#faq)

---

## 🎯 Overview

Your bot now supports:
- ✅ **Per-Server Configuration** - Each server has its own settings
- ✅ **Modulation Logging** - Logs go to a server-specific channel
- ✅ **Support Tickets** - Full ticket system with support teams
- ✅ **Button Interactions** - Users can create tickets with buttons

This means your bot can run in **hundreds of servers** without conflicts!

---

## ⚙️ Server Configuration

### What Gets Stored Per-Server?

Each server stores these settings in `data/serverConfig.json`:

```json
{
  "GUILD_ID": {
    "guildId": "GUILD_ID",
    "logChannel": "CHANNEL_ID or null",
    "ticketEnabled": true/false,
    "ticketChannel": "CHANNEL_ID or null",
    "ticketCategoryId": "CATEGORY_ID or null",
    "ticketModRoleId": "ROLE_ID or null",
    "ticketNextId": 1,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### Key Features

- **Isolated Settings** - Each server has completely separate configuration
- **JSON Storage** - Simple file-based system (can upgrade to database)
- **Automatic Cleanup** - Configs are created on first use
- **No Conflicts** - Settings from Server A never affect Server B

---

## 🎫 Ticket System

### What is a Ticket?

A **ticket** is a private support channel between a user and your staff team.

- 🔒 **Private** - Only the user and moderators can see it
- 🆔 **Numbered** - Each ticket gets a unique ID (e.g., #1, #2, #3)
- 📝 **Logged** - All activity can be logged to a channel
- 🗂️ **Organized** - All tickets are created in one category

### Ticket Workflow

```
User clicks "Create Ticket" button
         ↓
Ticket channel is created (ticket-1, ticket-2, etc.)
         ↓
User describes their issue
         ↓
Moderators join and help
         ↓
Moderator clicks "Close Ticket"
         ↓
Channel is deleted automatically
```

---

## 📝 New Commands

### Configuration Commands

#### `/setlogchannel <channel>`
Sets where moderation logs are sent

**Usage:**
```
/setlogchannel #mod-logs
```

**What Gets Logged:**
- Ban, kick, timeout, warn actions
- Command executions (optional)
- Moderation events
- Error messages

**Who Can Use:** Admin (MANAGE_GUILD permission)

---

#### `/removelogchannel`
Removes the log channel (logs won't be sent)

**Usage:**
```
/removelogchannel
```

**Who Can Use:** Admin (MANAGE_GUILD permission)

---

#### `/serverconfig`
View all current server settings

**Usage:**
```
/serverconfig
```

**Shows:**
- Current log channel
- Ticket system status
- Ticket channel
- Ticket category
- Ticket mod role

**Who Can Use:** Admin (MANAGE_GUILD permission)

---

### Ticket Commands

#### `/ticketconfig <channel> <category> <modrole>`
Set up the ticket system for your server

**Required:**
- `channel` - Text channel where the ticket button will be posted
- `category` - Category where ticket channels will be created
- `modrole` - Role that can manage tickets

**Example:**
```
/ticketconfig #support #ticket-category @Moderators
```

**What It Does:**
1. Saves the configuration
2. Posts a "Create Ticket" button in the channel

**Who Can Use:** Admin (MANAGE_GUILD permission)

---

#### `/ticket <reason>`
Create a new support ticket

**Usage:**
```
/ticket I need help with something
```

**What Happens:**
1. Creates a private channel: `ticket-1`, `ticket-2`, etc.
2. Only you and moderators can see it
3. A close button is added to the channel
4. You can describe your issue

**Who Can Use:** Everyone

---

#### `/closeticket`
Close the current ticket

**Usage:**
```
/closeticket
```

**What Happens:**
1. 5-second countdown starts
2. Channel is deleted
3. All messages are preserved (if logging is set up)

**Who Can Use:** Moderators or anyone in the ticket

---

#### `/ticketadd <user>`
Add a user to the current ticket

**Usage:**
```
/ticketadd @UserName
```

**What Happens:**
- User gets access to the ticket channel
- Can read and write messages

**Who Can Use:** Moderators only

---

#### `/ticketremove <user>`
Remove a user from the current ticket

**Usage:**
```
/ticketremove @UserName
```

**What Happens:**
- User loses access to the ticket channel
- Can no longer see messages

**Who Can Use:** Moderators only

---

## 🚀 Setup Instructions

### Step 1: Create Channels

You need to create these in your Discord server:

1. **Log Channel** (e.g., #mod-logs)
   - Where moderation actions are logged
   - Private channel (optional)

2. **Ticket Channel** (e.g., #support)
   - Where users see the "Create Ticket" button
   - Public channel

3. **Ticket Category** (e.g., "Support Tickets")
   - Where ticket channels are created
   - Keep it organized!

### Step 2: Configure Bot

As an admin, run these commands:

```
1. /setlogchannel #mod-logs
   (Sets where logs go)

2. /ticketconfig #support #ticket-category @Moderators
   (Sets up ticket system)
```

### Step 3: Verify Setup

Check everything with:
```
/serverconfig
```

You should see:
- ✅ Log Channel: #mod-logs
- ✅ Tickets Enabled: Yes
- ✅ Ticket Channel: #support
- ✅ Ticket Category: Support Tickets
- ✅ Ticket Mod Role: @Moderators

### Step 4: Test It

1. Go to #support
2. Click the "🎫 Create Ticket" button
3. Create a test ticket
4. Test `/ticketadd` and `/ticketremove`
5. Close the ticket with `/closeticket`

---

## 🔧 How It Works

### Configuration Storage

All settings are stored in `data/serverConfig.json`:

```json
{
  "123456789": {
    "logChannel": "987654321",
    "ticketEnabled": true,
    "ticketChannel": "111111111",
    ...
  },
  "999888777": {
    "logChannel": "555555555",
    ...
  }
}
```

**Key Points:**
- Each guild ID is unique
- Each server has completely separate settings
- Automatic save on every change
- Human-readable JSON format

### Logging System

When moderation actions happen:

```
Command: /ban @User
  ↓
Bot checks: Is there a log channel for this server?
  ↓
Yes → Sends embed to log channel
No → Skips logging
```

The bot never crashes if no log channel is set - it just doesn't log.

### Ticket System

When a user creates a ticket:

```
User clicks button
  ↓
Bot gets next ticket ID from config (e.g., #5)
  ↓
Creates channel: "ticket-5"
  ↓
Sets permissions:
  - Everyone: NO access
  - User: FULL access
  - Mods: FULL access
  ↓
Posts ticket info with close button
  ↓
Increments ID for next ticket
```

---

## ❓ FAQ

### Q: Do I need to set up logging?
**A:** No, it's optional. The bot works fine without it. Just run `/ticketconfig` if you only want tickets.

### Q: Can tickets be logged?
**A:** You can add logging integration. Currently, ticket actions are logged to console/file. You can enable channel logging by adding the log channel ID to ticket creation/closing messages.

### Q: What happens if I delete the log channel?
**A:** The bot will get an error trying to send logs there. Update the channel with `/removelogchannel` then `/setlogchannel #new-channel`.

### Q: Can I use the bot in multiple servers?
**A:** Yes! Each server has completely separate settings. You can run 1000+ servers and they won't interfere.

### Q: How do I backup my settings?
**A:** Your settings are in `data/serverConfig.json`. Back up this file to preserve all server configurations.

### Q: Can I upgrade to a database?
**A:** Yes! The `serverConfigManager.js` is designed to be easily modified to use SQLite, MongoDB, or any database. Just replace the file operations.

### Q: What if a moderator leaves?
**A:** Their role is still in the config. If you delete the role, ticket creation will fail. Run `/ticketconfig` again with a different role.

### Q: Can users create multiple tickets?
**A:** Yes. Each ticket gets a unique ID. Users can have as many open as they want.

### Q: Is there a ticket limit?
**A:** Discord has a limit of ~10,000 channels per server. You could create thousands of tickets before hitting this.

---

## 📊 Configuration File Structure

Location: `data/serverConfig.json`

### Example with Multiple Servers

```json
{
  "123456789012345678": {
    "guildId": "123456789012345678",
    "logChannel": "111111111111111111",
    "ticketEnabled": true,
    "ticketChannel": "222222222222222222",
    "ticketCategoryId": "333333333333333333",
    "ticketModRoleId": "444444444444444444",
    "ticketNextId": 5,
    "createdAt": "2024-12-20T10:30:00.000Z",
    "updatedAt": "2024-12-24T15:45:23.000Z"
  },
  "987654321098765432": {
    "guildId": "987654321098765432",
    "logChannel": null,
    "ticketEnabled": false,
    "ticketChannel": null,
    "ticketCategoryId": null,
    "ticketModRoleId": null,
    "ticketNextId": 1,
    "createdAt": "2024-12-24T10:00:00.000Z",
    "updatedAt": "2024-12-24T10:00:00.000Z"
  }
}
```

---

## 🔐 Permissions Required

### For Bot to Work

Bot needs these permissions in the guild:
- ✅ Send Messages
- ✅ Embed Links
- ✅ Manage Channels (for ticket creation)
- ✅ Manage Permissions (to set ticket permissions)
- ✅ Read Message History

### For Commands

| Command | Required Permission | Role |
|---------|-------------------|------|
| `/setlogchannel` | MANAGE_GUILD | Admin |
| `/removelogchannel` | MANAGE_GUILD | Admin |
| `/serverconfig` | MANAGE_GUILD | Admin |
| `/ticketconfig` | MANAGE_GUILD | Admin |
| `/ticket` | None | Everyone |
| `/closeticket` | Mod Role or MANAGE_GUILD | Mods/Admin |
| `/ticketadd` | Mod Role | Mods only |
| `/ticketremove` | Mod Role | Mods only |

---

## 🎓 Best Practices

### For Admins

1. **Organize Channels**
   - Keep logs and support separate
   - Use category for organization

2. **Set Clear Roles**
   - Create a dedicated Moderator role
   - Add trusted users to it

3. **Test Configuration**
   - Run `/serverconfig` after setup
   - Create a test ticket
   - Make sure logs are being recorded

### For Moderators

1. **Respond Promptly**
   - Users expect quick responses
   - Check tickets regularly

2. **Use `/ticketadd` Wisely**
   - Add team members when needed
   - Remove when conversation is done

3. **Close Tickets**
   - Close when issue is resolved
   - Users can create new tickets if needed

---

## 📞 Support

If you need help:
1. Check `/serverconfig` - verify all settings are correct
2. Test `/ticket` - create a test ticket
3. Check logs folder - see error messages
4. Verify bot permissions in server settings

---

**Your bot is now ready to serve multiple servers with full multi-server support!** 🎉
