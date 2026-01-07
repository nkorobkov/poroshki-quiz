/**
 * Verse selection and management utilities
 */

import { getPlayedVerses } from './storage';

/**
 * Get a unique ID for a verse (using number or lines as fallback)
 */
export function getVerseId(verse) {
  if (verse.number && verse.number !== '-1') {
    return verse.number;
  }
  // Use first line as ID for verses without numbers
  return verse.lines[0];
}

/**
 * Select random verses for a round, excluding already played ones
 */
export function selectVersesForRound(allVerses, count = 10) {
  const playedIds = new Set(getPlayedVerses());
  
  // Filter out played verses
  const availableVerses = allVerses.filter(verse => {
    const id = getVerseId(verse);
    return !playedIds.has(id);
  });
  
  // If not enough available, use all verses (reset scenario)
  const pool = availableVerses.length >= count ? availableVerses : allVerses;
  
  // Shuffle and select
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Normalize answer for comparison (lowercase, trim)
 */
export function normalizeAnswer(answer) {
  return answer.toLowerCase().replace(/ё/g, 'е').trim();
}

/**
 * Check if user's answer matches the correct answer
 */
export function checkAnswer(userAnswer, correctAnswer) {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  
  // Exact match
  return normalizedUser === normalizedCorrect;
}

/**
 * Generate a round ID from verse numbers (concatenated 2-char IDs)
 */
export function generateRoundId(verses) {
  return verses.map(verse => {
    const id = getVerseId(verse);
    // Ensure it's exactly 2 characters (pad if needed, truncate if longer)
    return id.length >= 2 ? id.substring(0, 2) : id.padEnd(2, '0');
  }).join('');
}

/**
 * Parse a round ID into an array of verse IDs (each 2 characters)
 */
export function parseRoundId(roundId) {
  if (!roundId || roundId.length % 2 !== 0) {
    return [];
  }
  const ids = [];
  for (let i = 0; i < roundId.length; i += 2) {
    ids.push(roundId.substring(i, i + 2));
  }
  return ids;
}

/**
 * Select verses by their IDs (for shared rounds, ignoring played status)
 */
export function selectVersesByIds(allVerses, verseIds) {
  const verseMap = new Map();
  allVerses.forEach(verse => {
    const id = getVerseId(verse);
    // Store both the full ID and the 2-char version for matching
    const twoCharId = id.length >= 2 ? id.substring(0, 2) : id.padEnd(2, '0');
    if (!verseMap.has(twoCharId)) {
      verseMap.set(twoCharId, verse);
    }
  });
  
  return verseIds
    .map(id => verseMap.get(id))
    .filter(verse => verse !== undefined);
}

