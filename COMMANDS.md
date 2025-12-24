# 📋 Complete Command Reference

## Admin & Moderation Commands

### /ban
Ban a user from the server
- **Permissions Required:** BAN_MEMBERS
- **Options:**
  - `user` (Required): User to ban
  - `reason` (Optional): Reason for ban

### /unban
Unban a previously banned user
- **Permissions Required:** BAN_MEMBERS
- **Options:**
  - `userid` (Required): User ID to unban
  - `reason` (Optional): Reason for unban

### /kick
Kick a user from the server
- **Permissions Required:** KICK_MEMBERS
- **Options:**
  - `user` (Required): User to kick
  - `reason` (Optional): Reason for kick

### /timeout
Temporarily mute a user
- **Permissions Required:** MODERATE_MEMBERS
- **Options:**
  - `user` (Required): User to timeout
  - `duration` (Required): Minutes (1-40320)
  - `reason` (Optional): Reason

### /untimeout
Remove timeout from a user
- **Permissions Required:** MODERATE_MEMBERS
- **Options:**
  - `user` (Required): User to un-timeout
  - `reason` (Optional): Reason

### /purge
Bulk delete messages
- **Permissions Required:** MANAGE_MESSAGES
- **Options:**
  - `amount` (Required): Messages to delete (1-100)

### /lock
Lock a channel (prevent @everyone from sending messages)
- **Permissions Required:** MANAGE_CHANNELS
- **Options:**
  - `channel` (Optional): Channel to lock (current if omitted)

### /unlock
Unlock a channel
- **Permissions Required:** MANAGE_CHANNELS
- **Options:**
  - `channel` (Optional): Channel to unlock

### /slowmode
Set channel slowmode
- **Permissions Required:** MANAGE_CHANNELS
- **Options:**
  - `seconds` (Required): Slowmode duration (0 to disable)
  - `channel` (Optional): Target channel

### /nick
Change a user's nickname
- **Permissions Required:** MANAGE_NICKNAMES
- **Options:**
  - `user` (Required): User to rename
  - `nickname` (Optional): New nickname (leave empty to reset)

### /warn
Warn a user
- **Permissions Required:** MODERATE_MEMBERS
- **Options:**
  - `user` (Required): User to warn
  - `reason` (Optional): Reason for warning

### /warnings
View user warnings
- **Permissions Required:** MODERATE_MEMBERS
- **Options:**
  - `user` (Required): User to check warnings for

### /clearwarnings
Clear all warnings for a user
- **Permissions Required:** MODERATE_MEMBERS
- **Options:**
  - `user` (Required): User to clear warnings for

---

## Role Commands

### /addrole
Add a role to a user
- **Permissions Required:** MANAGE_ROLES
- **Options:**
  - `user` (Required): User to add role to
  - `role` (Required): Role to add

### /removerole
Remove a role from a user
- **Permissions Required:** MANAGE_ROLES
- **Options:**
  - `user` (Required): User to remove role from
  - `role` (Required): Role to remove

### /createrole
Create a new role
- **Permissions Required:** MANAGE_ROLES
- **Options:**
  - `name` (Required): Role name
  - `color` (Optional): Color in hex format (#FF0000)

### /deleterole
Delete a role
- **Permissions Required:** MANAGE_ROLES
- **Options:**
  - `role` (Required): Role to delete

### /roleinfo
Get information about a role
- **Permissions Required:** None
- **Options:**
  - `role` (Required): Role to get info about

---

## Giveaway Commands

### /gstart
Start a new giveaway
- **Permissions Required:** MANAGE_GUILD
- **Options:**
  - `prize` (Required): Prize description
  - `duration` (Required): Duration in minutes
  - `winners` (Required): Number of winners

### /gend
End a giveaway manually
- **Permissions Required:** MANAGE_GUILD
- **Options:**
  - `messageid` (Required): Message ID of giveaway

### /greroll
Reroll giveaway winners
- **Permissions Required:** MANAGE_GUILD
- **Options:**
  - `messageid` (Required): Message ID of giveaway

### /glist
List all active giveaways
- **Permissions Required:** None
- **Options:** None

---

## Music Commands

### /play
Play music from YouTube
- **Permissions Required:** None
- **Options:**
  - `query` (Required): Song name or YouTube URL

### /pause
Pause current song
- **Permissions Required:** None
- **Options:** None

### /resume
Resume music playback
- **Permissions Required:** None
- **Options:** None

### /skip
Skip to next song
- **Permissions Required:** None
- **Options:** None

### /queue
View music queue
- **Permissions Required:** None
- **Options:** None

### /stop
Stop music and disconnect
- **Permissions Required:** None
- **Options:** None

### /nowplaying
Show currently playing song
- **Permissions Required:** None
- **Options:** None

---

## Utility Commands

### /ping
Check bot latency
- **Permissions Required:** None
- **Options:** None

### /uptime
Check bot uptime
- **Permissions Required:** None
- **Options:** None

### /serverinfo
Get server information
- **Permissions Required:** None
- **Options:** None

### /userinfo
Get user information
- **Permissions Required:** None
- **Options:**
  - `user` (Optional): User to check (yourself if omitted)

### /avatar
Get user avatar
- **Permissions Required:** None
- **Options:**
  - `user` (Optional): User's avatar (yours if omitted)

### /banner
Get user banner
- **Permissions Required:** None
- **Options:**
  - `user` (Optional): User's banner (yours if omitted)

### /poll
Create a simple poll
- **Permissions Required:** None
- **Options:**
  - `question` (Required): Poll question
  - `option1` (Required): First option
  - `option2` (Required): Second option

### /embed
Create custom embeds
- **Permissions Required:** None
- **Subcommands:**
  - `create`: Create and send an embed
    - `title` (Optional): Embed title
    - `description` (Optional): Description
    - `color` (Optional): Hex color (#FF0000)

### /remind
Set a reminder
- **Permissions Required:** None
- **Options:**
  - `minutes` (Required): Minutes until reminder (1-10080)
  - `message` (Required): Reminder message

---

## Fun Commands

### /8ball
Magic 8-ball answer
- **Permissions Required:** None
- **Options:**
  - `question` (Required): Your question

### /coinflip
Flip a coin
- **Permissions Required:** None
- **Options:** None

### /say
Echo a message
- **Permissions Required:** MANAGE_MESSAGES
- **Options:**
  - `message` (Required): Message to echo

### /ship
Ship two users together
- **Permissions Required:** None
- **Options:**
  - `user1` (Required): First user
  - `user2` (Required): Second user

### /howgay
Check gayness level (fun)
- **Permissions Required:** None
- **Options:**
  - `user` (Optional): User to check (yourself if omitted)

### /roast
Roast a user
- **Permissions Required:** None
- **Options:**
  - `user` (Optional): User to roast (yourself if omitted)

### /meme
Get a random meme
- **Permissions Required:** None
- **Options:** None

### /joke
Get a random joke
- **Permissions Required:** None
- **Options:** None

---

## Permission Levels

| Level | Required Permission | Examples |
|-------|-------------------|----------|
| **Admin** | ADMINISTRATOR | Ban, Kick, Manage Roles |
| **Moderator** | Multiple Mod Perms | Timeout, Warn, Purge |
| **User** | Basic Permissions | Most utility commands |
| **Everyone** | None | Fun, Music, Info commands |

---

## Notes

- All commands use Discord's slash command system (`/`)
- Permissions are checked both for the user and the bot
- Moderation actions are logged if configured
- All commands have cooldown protection (3 seconds default)
- Commands are case-insensitive
- Some commands support ephemeral (private) responses

---

*For the latest updates, check the README.md file*
