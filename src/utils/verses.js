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

