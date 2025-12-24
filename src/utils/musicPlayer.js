// Music Player Utility
// Manages music playback and queue

import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { play } from 'play-dl';

const players = new Map();
const queues = new Map();

/**
 * Get or create a music player for a guild
 * @param {string} guildId - Guild ID
 * @returns {AudioPlayer} - Audio player instance
 */
export function getPlayer(guildId) {
  if (!players.has(guildId)) {
    const player = createAudioPlayer();
    players.set(guildId, {
      player,
      queue: [],
      playing: null,
    });
  }
  return players.get(guildId);
}

/**
 * Add song to queue
 * @param {string} guildId - Guild ID
 * @param {Object} song - Song object with title and url
 */
export function addToQueue(guildId, song) {
  const player = getPlayer(guildId);
  player.queue.push(song);
}

/**
 * Get queue for guild
 * @param {string} guildId - Guild ID
 * @returns {Array} - Queue array
 */
export function getQueue(guildId) {
  const player = getPlayer(guildId);
  return player.queue;
}

/**
 * Get current playing song
 * @param {string} guildId - Guild ID
 * @returns {Object|null} - Current song or null
 */
export function getNowPlaying(guildId) {
  const player = getPlayer(guildId);
  return player.playing;
}

/**
 * Clear queue
 * @param {string} guildId - Guild ID
 */
export function clearQueue(guildId) {
  const player = getPlayer(guildId);
  player.queue = [];
  player.playing = null;
}

/**
 * Remove song from queue
 * @param {string} guildId - Guild ID
 * @param {number} index - Song index
 */
export function removeFromQueue(guildId, index) {
  const player = getPlayer(guildId);
  if (index >= 0 && index < player.queue.length) {
    player.queue.splice(index, 1);
  }
}

export default {
  getPlayer,
  addToQueue,
  getQueue,
  getNowPlaying,
  clearQueue,
  removeFromQueue,
};
