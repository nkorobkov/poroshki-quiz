/**
 * Local storage utilities for tracking played verses
 */

const STORAGE_KEY = 'poroshki_played_verses';

/**
 * Get list of played verse IDs from local storage
 */
export function getPlayedVerses() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Add a verse ID to the played list
 */
export function markVerseAsPlayed(verseId) {
  const played = getPlayedVerses();
  if (!played.includes(verseId)) {
    played.push(verseId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(played));
  }
}

/**
 * Clear all played verses (for testing/reset)
 */
export function clearPlayedVerses() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get count of played verses
 */
export function getPlayedCount() {
  return getPlayedVerses().length;
}

/**
 * Game state storage
 */
const GAME_STATE_KEY = 'poroshki_game_state';

/**
 * Save current game state
 */
export function saveGameState(gameState) {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.error('Error saving game state:', e);
  }
}

/**
 * Load saved game state
 */
export function loadGameState() {
  try {
    const stored = localStorage.getItem(GAME_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Clear saved game state
 */
export function clearGameState() {
  localStorage.removeItem(GAME_STATE_KEY);
}

