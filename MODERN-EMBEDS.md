# 🎨 Modern Embed System

**Beautiful, Clean, & Consistent Discord Embeds**

---

## Overview

Your bot now uses a **modern, minimalist embed design** across all commands. We've created a reusable embed builder utility that keeps your responses clean, professional, and consistent.

---

## Updated Color Palette

Modern, soft colors for better visual appeal:

```javascript
colors: {
  success: 0x2ecc71,      // ✅ Soft green
  error: 0xe74c3c,        // ❌ Soft red
  info: 0x3498db,         // ℹ️ Modern blue
  warning: 0xf39c12,      // ⚠️ Modern orange
  moderation: 0x9b59b6,   // 🔨 Purple
  giveaway: 0x1abc9c,     // 🎉 Teal
  primary: 0x2c3e50,      // General dark slate
  secondary: 0x95a5a6,    // General light gray
}
```

---

## Using the Embed Helpers

### Import the helpers:

```javascript
import { 
  successEmbed, 
  errorEmbed, 
  infoEmbed, 
  warningEmbed,
  customEmbed 
} from '../../utils/embedBuilder.js';
```

### Success Embed (✅)

```javascript
const embed = successEmbed(
  'Action Complete',
  'Your action was successful',
  {
    fields: [
      { name: 'Status', value: 'Done', inline: true }
    ],
    footer: 'Operation complete'
  }
);

await interaction.reply({ embeds: [embed] });
```

### Error Embed (❌)

```javascript
const embed = errorEmbed(
  'Action Failed',
  'Something went wrong',
  {
    fields: [
      { name: 'Reason', value: 'Invalid input', inline: false }
    ],
    footer: 'Please try again'
  }
);

await interaction.reply({ embeds: [embed], ephemeral: true });
```

### Info Embed (ℹ️)

```javascript
const embed = infoEmbed(
  'Server Status',
  '10 members online',
  {
    fields: [
      { name: 'Members', value: '100', inline: true },
      { name: 'Channels', value: '15', inline: true }
    ],
    thumbnail: guild.iconURL(),
    footer: 'Updated now'
  }
);

await interaction.reply({ embeds: [embed] });
```

### Warning Embed (⚠️)

```javascript
const embed = warningEmbed(
  'Please Confirm',
  'This action cannot be undone',
  {
    fields: [
      { name: 'Items', value: '500 deleted', inline: false }
    ],
    footer: 'Type /confirm to proceed'
  }
);

await interaction.reply({ embeds: [embed] });
```

### Custom Embed

For full control:

```javascript
const embed = customEmbed({
  color: config.colors.primary,
  title: 'Custom Embed',
  description: 'Complete customization',
  fields: [
    { name: 'Field 1', value: 'Value 1', inline: true },
    { name: 'Field 2', value: 'Value 2', inline: true }
  ],
  thumbnail: 'https://...',
  image: 'https://...',
  author: { name: 'Author', iconURL: 'https://...' },
  footer: { text: 'Custom footer' }
});
```

---

## Parameters

### Common Options

All embed helpers accept an `options` object:

```javascript
{
  fields: [
    { name: 'Field Name', value: 'Field Value', inline: true|false }
  ],
  footer: 'Custom footer text',        // Can be string or false to disable
  timestamp: true|false,                // Auto-adds current time (default: true)
  thumbnail: 'https://...',             // For info embeds
  image: 'https://...',                 // For custom embeds
  author: { name: 'Name', ... },        // For custom embeds
}
```

---

## Examples

### Ping Command (Before & After)

**Before:**
```javascript
const pingEmbed = new EmbedBuilder()
  .setColor(config.colors.info)
  .setTitle('🏓 Pong!')
  .addFields(
    { name: 'Latency', value: `${latency}ms`, inline: true },
    { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
  )
  .setTimestamp();
```

**After:**
```javascript
const pingEmbed = infoEmbed('Pong!', null, {
  fields: [
    { name: 'Bot Latency', value: `${latency}ms`, inline: true },
    { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
  ],
  footer: `Check completed • ${new Date().toLocaleTimeString()}`
});
```

### Role Request Command (Before & After)

**Before:**
```javascript
const embed = new EmbedBuilder()
  .setColor(config.colors.success)
  .setTitle('✅ Request Submitted')
  .setDescription(`Your request for **${role.name}** has been submitted`)
  .addFields(
    { name: 'Role', value: `${role}`, inline: true },
    { name: 'Status', value: '⏳ Pending Approval', inline: true }
  )
  .setFooter({ text: 'Requests expire after 7 days' })
  .setTimestamp();
```

**After:**
```javascript
const embed = successEmbed(
  'Request Submitted', 
  `Your request for **${role.name}** is pending approval`,
  {
    fields: [
      { name: 'Role', value: `${role}`, inline: true },
      { name: 'Expires', value: '7 days', inline: true }
    ],
    footer: 'Request pending'
  }
);
```

---

## Benefits

✅ **Consistent Design** - All embeds follow the same modern style  
✅ **Less Code** - Helpers reduce boilerplate  
✅ **Easy Updates** - Change all embeds by updating the utility  
✅ **Professional Look** - Soft colors and clean layout  
✅ **Accessible** - Better readability with improved contrast  
✅ **Mobile Friendly** - Optimized for Discord mobile clients  

---

## Migration Guide

To update existing commands:

1. **Remove old imports:**
   ```javascript
   // OLD - Remove these
   import { EmbedBuilder } from 'discord.js';
   import config from '../../config/config.js';
   ```

2. **Add new imports:**
   ```javascript
   // NEW - Add these
   import { successEmbed, errorEmbed, infoEmbed } from '../../utils/embedBuilder.js';
   ```

3. **Replace embed creation:**
   ```javascript
   // OLD
   const embed = new EmbedBuilder()
     .setColor(config.colors.success)
     .setTitle('✅ Title')
     .setDescription('Description')
     .setTimestamp();

   // NEW
   const embed = successEmbed('Title', 'Description');
   ```

4. **Test the command** to ensure embeds look good

---

## Updated Commands

✅ ping.js - Modern latency check  
✅ uptime.js - Clean uptime display  
✅ serverinfo.js - Professional server stats  
✅ 8ball.js - Simple magic 8-ball response  
✅ rolerequest.js - Beautiful role requests  

*More commands will be updated over time*

---

## Quick Reference

| Helper | Use Case | Icon |
|--------|----------|------|
| `successEmbed()` | Actions completed | ✅ |
| `errorEmbed()` | Actions failed | ❌ |
| `infoEmbed()` | Display information | ℹ️ |
| `warningEmbed()` | Require confirmation | ⚠️ |
| `customEmbed()` | Full customization | 🎨 |

---

## File Location

All embed helpers are in:  
**`src/utils/embedBuilder.js`**

Import from any command file with:
```javascript
import { successEmbed, errorEmbed, infoEmbed, warningEmbed, customEmbed } from '../../utils/embedBuilder.js';
```

---

## Color Usage Guide

- **Success (Green)**: Confirmations, completions, approvals
- **Error (Red)**: Failures, denials, errors
- **Info (Blue)**: General information, stats, details
- **Warning (Orange)**: Cautions, confirmations needed
- **Moderation (Purple)**: Admin actions, warnings, timeouts
- **Giveaway (Teal)**: Events, giveaways, special announcements

---

**Your bot now has a modern, professional look! 🎉**
