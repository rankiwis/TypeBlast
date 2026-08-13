/**
 * Standard Typing Test Calculator & Validation Utilities
 *
 * WPM Formula:
 * Standard international touch-typing standard defines 1 word = 5 characters (including spaces).
 * Net WPM = (Total Correct Characters / 5) / (Time Elapsed in Minutes)
 * Gross WPM = (Total Typed Characters / 5) / (Time Elapsed in Minutes)
 * Accuracy = (Correct Characters / Total Typed Characters) * 100
 */

/**
 * Calculates Net WPM (Words Per Minute) based on correct character count and time elapsed in seconds.
 */
export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars < 0) return 0;
  const minutes = elapsedSeconds / 60;
  const netWpm = Math.round((correctChars / 5) / minutes);
  return Math.max(0, netWpm);
}

/**
 * Calculates Gross WPM (Raw WPM) including mistyped characters.
 */
export function calculateGrossWpm(totalTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || totalTypedChars < 0) return 0;
  const minutes = elapsedSeconds / 60;
  const grossWpm = Math.round((totalTypedChars / 5) / minutes);
  return Math.max(0, grossWpm);
}

/**
 * Calculates typing accuracy percentage separately from WPM.
 */
export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars <= 0) return 100;
  const accuracy = Math.round((correctChars / totalTypedChars) * 100);
  return Math.min(100, Math.max(0, accuracy));
}

/**
 * Calculates CPM (Characters Per Minute).
 */
export function calculateCpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars < 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(correctChars / minutes));
}

/**
 * Calculates the number of fully completed, correctly typed words.
 */
export function calculateCompletedWords(userInput: string, targetText: string): number {
  if (!userInput || !targetText) return 0;

  const userWords = userInput.split(" ");
  const targetWords = targetText.split(" ");

  let completedCount = 0;
  for (let i = 0; i < userWords.length - 1; i++) {
    if (i < targetWords.length && userWords[i] === targetWords[i]) {
      completedCount++;
    }
  }

  // Check the last word if user finished or pressed space
  if (userWords.length > 0 && userWords.length <= targetWords.length) {
    const lastIdx = userWords.length - 1;
    if (userWords[lastIdx] === targetWords[lastIdx]) {
      completedCount++;
    }
  }

  return completedCount;
}

export interface TestResultPayload {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;
  timeElapsed: number;
  totalChars: number;
  correctChars: number;
  errorCount: number;
}

/**
 * Validates test results to prevent client-side score manipulation before storing or uploading.
 */
export function validateTestResult(
  stats: TestResultPayload,
  maxAllowedWpm: number = 250
): { isValid: boolean; reason?: string } {
  const { wpm, rawWpm, accuracy, duration, timeElapsed, totalChars, correctChars, errorCount } = stats;

  if (wpm < 0 || rawWpm < 0) {
    return { isValid: false, reason: "Negative WPM values are invalid." };
  }

  if (wpm > maxAllowedWpm) {
    return { isValid: false, reason: `WPM score exceeds maximum theoretical limit (${maxAllowedWpm} WPM).` };
  }

  if (accuracy < 0 || accuracy > 100) {
    return { isValid: false, reason: "Accuracy must be between 0% and 100%." };
  }

  if (correctChars < 0 || totalChars < 0) {
    return { isValid: false, reason: "Character counts cannot be negative." };
  }

  if (correctChars > totalChars) {
    return { isValid: false, reason: "Correct characters cannot exceed total typed characters." };
  }

  if (timeElapsed <= 0) {
    return { isValid: false, reason: "Test duration elapsed time must be greater than zero." };
  }

  // Verify calculated WPM matches character formula within rounding margin
  const expectedWpm = calculateWpm(correctChars, timeElapsed);
  if (Math.abs(wpm - expectedWpm) > 3) {
    return { isValid: false, reason: "WPM math inconsistency detected." };
  }

  const expectedAccuracy = calculateAccuracy(correctChars, totalChars);
  if (Math.abs(accuracy - expectedAccuracy) > 2) {
    return { isValid: false, reason: "Accuracy math inconsistency detected." };
  }

  return { isValid: true };
}
