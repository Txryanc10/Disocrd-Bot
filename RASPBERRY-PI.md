# 🍓 Raspberry Pi 4 Deployment Guide

**Complete Guide to Running Your Discord Bot on Raspberry Pi 4**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Hardware Requirements](#hardware-requirements)
3. [Software Setup](#software-setup)
4. [Bot Installation](#bot-installation)
5. [Auto-Start Configuration](#auto-start-configuration)
6. [Performance Optimization](#performance-optimization)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Your Discord bot is **perfect for Raspberry Pi 4** because it:
- ✅ Uses minimal RAM (~100-200MB)
- ✅ Low CPU usage (runs efficiently)
- ✅ Node.js native support
- ✅ 24/7 always-on deployment
- ✅ Very cost-effective ($35-75)

**Estimated Monthly Cost:** $3-5 in electricity

---

## 🔧 Hardware Requirements

### Recommended Setup

**Minimum:**
- Raspberry Pi 4 (2GB RAM)
- Micro SD Card (16GB+)
- Power Supply (5V 3A)

**Recommended:**
- Raspberry Pi 4 (4GB RAM) ⭐ Best
- Micro SD Card (32GB)
- Power Supply (5V 3A)
- Active Cooling (heatsinks)

### Optional But Helpful

- USB Keyboard & Mouse
- HDMI Cable & Monitor
- Network Cable (vs WiFi)
- Micro SD Card Reader
- Case with ventilation

**Total Cost:** $50-100 USD

---

## 💻 Software Setup

### Step 1: Flash Raspberry Pi OS

**Option A: Using Raspberry Pi Imager (Easiest)**

1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Insert Micro SD Card into computer
3. Open Imager
4. Choose OS: **Raspberry Pi OS Lite** (lightweight)
5. Choose Storage: Your SD Card
6. Click Write (wait ~5 minutes)
7. Eject SD Card

**Option B: Manual Method**

```bash
# Download image
wget https://downloads.raspberrypi.org/raspios_lite_arm64/images/raspios_lite_arm64-2024-12-xx/xxxxx.img.xz

# Flash to SD card (Linux/Mac)
unxz -c raspios_lite_arm64-2024-12-xx.img.xz | sudo dd bs=4M of=/dev/sdX

# Eject after writing
sudo sync
```

### Step 2: Boot and Connect

1. Insert SD Card into Raspberry Pi
2. Connect Power, Ethernet/WiFi
3. Wait 2 minutes for first boot
4. Open terminal on another computer

```bash
# SSH into Pi (default password: raspberry)
ssh pi@raspberrypi.local
```

### Step 3: Initial Setup

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Change password
passwd

# Set timezone
sudo timedatectl set-timezone America/New_York

# Enable SSH (if not already)
sudo raspi-config
# Select 5 (Interfacing Options)
# Select 3 (SSH)
# Choose Yes
# Exit
```

---

## 🚀 Bot Installation

### Step 1: Install Node.js

**Install Latest Node.js LTS**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

### Step 2: Transfer Bot Files

**Option A: Git Clone (Recommended)**

```bash
# Install git if needed
sudo apt install -y git

# Clone your repository
cd ~
git clone https://github.com/YOUR_USERNAME/discord-bot.git
cd discord-bot
```

**Option B: SCP Transfer**

```bash
# From your computer (Windows: use Git Bash or WSL)
# Replace with your actual Pi's hostname/IP and path
scp -r "path/to/Discord-Bot" pi@raspberrypi.local:~/discord-bot

# Example (Linux/Mac):
scp -r ~/path/to/Discord-Bot pi@raspberrypi.local:~/discord-bot

# If using IP address instead:
scp -r ~/path/to/Discord-Bot pi@192.168.1.100:~/discord-bot
```

### Step 3: Install Dependencies

```bash
cd ~/discord-bot
npm install

# This may take 5-10 minutes on Raspberry Pi
# Be patient!
```

### Step 4: Configure Bot

```bash
# Create .env file
nano .env
```

Add your configuration:
```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id
GUILD_ID=your_test_server_id
```

Save with: `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 5: Test Bot

```bash
# Run bot manually
npm start

# You should see:
# ✅ Bot is ready!
# 📝 Slash commands registered

# Press Ctrl+C to stop
```

---

## ⚙️ Auto-Start Configuration

### Option 1: PM2 (Recommended) ⭐

**Install PM2**

```bash
sudo npm install -g pm2

# Allow PM2 to restart on boot
pm2 startup
# Copy and run the output command
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
```

**Start Bot with PM2**

```bash
cd ~/discord-bot
pm2 start npm --name "discord-bot" -- start

# Save the configuration
pm2 save

# Verify it will auto-start
pm2 startup
```

**PM2 Commands**

```bash
# Check status
pm2 status

# View logs
pm2 logs discord-bot

# Stop bot
pm2 stop discord-bot

# Restart bot
pm2 restart discord-bot

# Remove from PM2
pm2 delete discord-bot
```

### Option 2: Systemd Service

**Create Service File**

```bash
sudo nano /etc/systemd/system/discord-bot.service
```

Add this content:

```ini
[Unit]
Description=Discord Bot
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/discord-bot
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save with: `Ctrl+O`, `Enter`, `Ctrl+X`

**Enable and Start Service**

```bash
# Enable service
sudo systemctl enable discord-bot

# Start service
sudo systemctl start discord-bot

# Check status
sudo systemctl status discord-bot

# View logs
sudo journalctl -u discord-bot -f
```

### Option 3: Cron Job (Simple)

```bash
# Edit crontab
crontab -e

# Add this line at the bottom:
@reboot cd /home/pi/discord-bot && npm start > /tmp/discord-bot.log 2>&1 &

# Save with: Ctrl+O, Enter, Ctrl+X
```

---

## 🚀 Performance Optimization

### 1. Reduce Swap Usage

Excessive swapping slows down Raspberry Pi:

```bash
# Check current swap
free -h

# Reduce swap from 100MB to 10MB
sudo dphys-swapfile swapoff
sudo sed -i 's/CONF_SWAPSIZE=100/CONF_SWAPSIZE=10/' /etc/dphys-swapfile
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### 2. Enable Read-Only Root Filesystem (Optional)

For maximum reliability:

```bash
# Convert to read-only filesystem
# This prevents SD card corruption from power loss
sudo apt install -y raspi-readonly

# Enable read-only
sudo raspi-readonly install

# Reboot
sudo reboot
```

### 3. Optimize Node.js Settings

```bash
# Create startup script
nano ~/discord-bot/start.sh
```

Add:

```bash
#!/bin/bash
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=256"
npm start
```

Save and make executable:

```bash
chmod +x ~/discord-bot/start.sh

# Update PM2 to use this script
pm2 start ./start.sh --name "discord-bot"
pm2 save
```

### 4. Enable GPU Memory Split

```bash
sudo raspi-config
# 3. Boot Options
# G2. GPU Memory
# Set to 16MB (minimum for bot)
```

### 5. Update Regularly

```bash
# Every month, update your bot
cd ~/discord-bot
git pull
npm update
pm2 restart discord-bot
```

---

## 📊 Monitoring & Maintenance

### Check System Resources

**Real-Time Monitoring**

```bash
# Install htop
sudo apt install -y htop

# View system resources
htop

# Exit with: q
```

**Discord Bot Specific**

```bash
# Check memory usage
ps aux | grep "npm start"

# View bot logs
pm2 logs discord-bot

# Get disk space
df -h

# Get CPU temperature
vcgencmd measure_temp
```

### Regular Maintenance

**Weekly:**
```bash
# Check logs for errors
pm2 logs discord-bot

# Check disk space
df -h
```

**Monthly:**
```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Update bot dependencies
cd ~/discord-bot
npm update

# Restart bot
pm2 restart discord-bot
```

**Quarterly:**
```bash
# Update Node.js
sudo npm install -g n
sudo n lts
sudo npm install -g npm

# Restart
sudo reboot
```

### Backup Your Data

**Backup Bot Files**

```bash
# Create backup
cd ~
tar -czf discord-bot-backup-$(date +%Y%m%d).tar.gz discord-bot/

# List backups
ls -lh discord-bot-backup-*.tar.gz
```

**Backup Database Files**

```bash
# Important! These have all your settings
cp -r ~/discord-bot/data ~/discord-bot/data-backup-$(date +%Y%m%d)

# Transfer to computer
scp -r pi@raspberrypi.local:~/discord-bot/data* .
```

---

## 🆘 Troubleshooting

### Bot Won't Start

**Check if Node.js is installed:**
```bash
node --version
```

**Check logs:**
```bash
pm2 logs discord-bot
```

**Check .env file:**
```bash
cat ~/discord-bot/.env
# Should show your token and IDs
```

### High CPU/Memory Usage

```bash
# Check what's using resources
htop

# Kill any duplicate processes
pkill -f "npm start"

# Restart bot
pm2 restart discord-bot
```

### Bot Stops Running

**Check if service is enabled:**
```bash
sudo systemctl status discord-bot
sudo systemctl enable discord-bot
sudo systemctl start discord-bot
```

**Check if PM2 daemon is running:**
```bash
pm2 status
pm2 resurrect  # Restore crashed processes
```

### Slow Performance

```bash
# Check temperature (should be < 80°C)
vcgencmd measure_temp

# Check disk space (should be > 10% free)
df -h

# Check memory (should have > 100MB free)
free -h

# Reduce background processes
sudo systemctl disable wifi-country
sudo systemctl disable dhcpcd
```

### Connection Issues

```bash
# If using WiFi, try ethernet instead
# Or check WiFi signal strength
iwconfig

# Restart network
sudo systemctl restart networking

# Check DNS
nslookup discord.com
```

### SD Card Corruption

**Prevention:**
- Always shutdown properly: `sudo shutdown -h now`
- Use quality SD cards (Samsung, SanDisk)
- Enable read-only filesystem
- Use UPS/battery backup

**Recovery:**
- Reimage SD card
- Restore from backup

---

## 📊 Expected Performance

### Typical Resource Usage

| Metric | Usage |
|--------|-------|
| **RAM** | 120-200 MB |
| **CPU** | 5-15% |
| **Disk** | ~500 MB |
| **Network** | < 1 Mbps |
| **Temperature** | 40-60°C |
| **Uptime** | 99.9% |

### On Heavy Load (Many Servers)

| Metric | Usage |
|--------|-------|
| **RAM** | 300-400 MB |
| **CPU** | 30-50% |
| **Network** | 2-5 Mbps |
| **Temperature** | 60-70°C |

---

## 🎯 Best Practices

✅ **Do:**
- Use Ethernet for stable connection
- Keep Pi in cool, ventilated location
- Enable automatic updates
- Backup data monthly
- Monitor temperature
- Keep Node.js updated

❌ **Don't:**
- Expose Pi to internet directly
- Run heavy processes simultaneously
- Use slow WiFi if possible
- Ignore disk space warnings
- Force shutdown (always use shutdown command)
- Max out CPU for extended periods

---

## 📈 Scaling Tips

### Single Bot in 1-10 Servers
- Raspberry Pi 4 (2GB) - No problem
- 24/7 uptime easily achievable

### Growing to 50+ Servers
- Upgrade to Raspberry Pi 4 (4GB)
- Consider dedicated cooling
- Monitor temperature regularly

### Large Scale (100+ Servers)
- Consider moving to:
  - Desktop PC
  - VPS/Cloud server ($5-20/month)
  - Multi-instance setup

---

## 💡 Power Consumption

**Estimated Cost:**

```
Raspberry Pi 4 (idle):  ~2.5W
With bot running:       ~5-7W
With heavy load:        ~10-12W

Annual cost (24/7):
5W × 24h × 365 days = 43.8 kWh
At $0.12/kWh = $5.26/year
```

**Very affordable for 24/7 hosting!**

---

## 🔗 Useful Links

- [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/)
- [Node.js on Raspberry Pi](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Discord.js Guide](https://discordjs.guide/)

---

## 📞 Getting Help

If you have issues:

1. Check `/logs` folder for errors
2. View PM2 logs: `pm2 logs`
3. Check system resources: `htop`
4. Verify bot token in `.env`
5. Check Discord.js documentation
6. Try restarting: `pm2 restart discord-bot`

---

## ✅ Checklist

- [ ] Raspberry Pi 4 (2GB+ RAM)
- [ ] Micro SD Card (16GB+)
- [ ] Power supply and cooling
- [ ] Flashed Raspberry Pi OS
- [ ] Updated system
- [ ] Installed Node.js
- [ ] Transferred bot files
- [ ] Installed dependencies with npm
- [ ] Created .env file with token
- [ ] Tested bot with `npm start`
- [ ] Installed PM2 and enabled auto-start
- [ ] Verified bot stays running
- [ ] Set up monitoring

---

**Your Discord bot is now running 24/7 on Raspberry Pi! 🎉**

*Enjoy reliable, affordable bot hosting!*
