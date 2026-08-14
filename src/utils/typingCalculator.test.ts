/**
 * Automated Unit Tests for Typing Test Calculator & Validation Engine
 */

import {
  calculateWpm,
  calculateGrossWpm,
  calculateAccuracy,
  calculateCpm,
  calculateCompletedWords,
  validateTestResult,
} from "./typingCalculator";
import { validateAndSanitizeSubmission, sanitizeText } from "../../server/leaderboardStore";

function runTests() {
  console.log("==========================================");
  console.log("🧪 RUNNING COMPREHENSIVE SECURITY & VALIDATION TESTS");
  console.log("==========================================");

  let passed = 0;
  let failed = 0;

  function assert(description: string, condition: boolean, actual?: any, expected?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
      if (actual !== undefined) console.error(`     Actual:   ${actual}`);
      if (expected !== undefined) console.error(`     Expected: ${expected}`);
      failed++;
    }
  }

  // 1. WPM Calculation Tests
  console.log("\n--- 1. WPM Calculation Tests ---");
  // 300 correct chars in 60 seconds = (300/5)/1 = 60 WPM
  assert("300 correct chars in 60s should equal 60 WPM", calculateWpm(300, 60) === 60, calculateWpm(300, 60), 60);

  // 150 correct chars in 30 seconds = (150/5)/(0.5) = 60 WPM
  assert("150 correct chars in 30s should equal 60 WPM", calculateWpm(150, 30) === 60, calculateWpm(150, 30), 60);

  // 450 correct chars in 180 seconds (3 min) = (450/5)/3 = 30 WPM
  assert("450 correct chars in 180s should equal 30 WPM", calculateWpm(450, 180) === 30, calculateWpm(450, 180), 30);

  // 0 correct chars in 60s should equal 0 WPM
  assert("0 correct chars should equal 0 WPM", calculateWpm(0, 60) === 0, calculateWpm(0, 60), 0);

  // 0 elapsed time should safely return 0 WPM without division by zero
  assert("0 elapsed seconds should return 0 WPM", calculateWpm(200, 0) === 0, calculateWpm(200, 0), 0);

  // 2. Gross WPM & CPM Tests
  console.log("\n--- 2. Gross WPM & CPM Tests ---");
  assert("Gross WPM handles total typed chars", calculateGrossWpm(400, 60) === 80, calculateGrossWpm(400, 60), 80);
  assert("CPM calculates characters per minute", calculateCpm(300, 60) === 300, calculateCpm(300, 60), 300);

  // 3. Accuracy Calculation Tests
  console.log("\n--- 3. Accuracy Calculation Tests ---");
  assert("100/100 chars should be 100% accuracy", calculateAccuracy(100, 100) === 100, calculateAccuracy(100, 100), 100);
  assert("90/100 chars should be 90% accuracy", calculateAccuracy(90, 100) === 90, calculateAccuracy(90, 100), 90);
  assert("0 typed chars should default to 100% accuracy", calculateAccuracy(0, 0) === 100, calculateAccuracy(0, 0), 100);

  // 4. Completed Words Counter
  console.log("\n--- 4. Completed Words Tests ---");
  const target = "the quick brown fox jumps over the lazy dog";
  const userTyped = "the quick brown fox";
  assert("Counts correctly typed words", calculateCompletedWords(userTyped, target) === 4, calculateCompletedWords(userTyped, target), 4);

  // 5. Client-Side Score Validation Tests
  console.log("\n--- 5. Client-Side Score Validation Tests ---");
  const validPayload = {
    wpm: 60,
    rawWpm: 63,
    accuracy: 95,
    duration: 60,
    timeElapsed: 60,
    totalChars: 316,
    correctChars: 300,
    errorCount: 16,
  };
  assert("Validates honest score payload", validateTestResult(validPayload).isValid === true);

  const tamperedScore = {
    ...validPayload,
    wpm: 350, // Impossible score
  };
  assert("Rejects impossible WPM scores (> 250 WPM)", validateTestResult(tamperedScore).isValid === false);

  const mathematicallyInconsistentScore = {
    ...validPayload,
    wpm: 60,
    correctChars: 100, // 100 chars in 60s should be 20 WPM, not 60
  };
  assert("Rejects mathematically inconsistent WPM claims", validateTestResult(mathematicallyInconsistentScore).isValid === false);

  // 6. Server-Side Security & Anti-Tamper Tests
  console.log("\n--- 6. Server-Side Anti-Tamper & Score Validation Tests ---");

  // A. Legitimate submission
  const validServerPayload = {
    wpm: 60,
    rawWpm: 63,
    accuracy: 95,
    totalChars: 316,
    correctChars: 300,
    errorCount: 16,
    duration: 60,
    displayName: "Jane Doe",
    username: "janedoe",
  };
  const validResult = validateAndSanitizeSubmission(validServerPayload);
  assert("Accepts legitimate typing score", validResult.isValid === true);

  // B. Falsified high WPM (e.g. 240 WPM on 60s test)
  const impossibleWpmResult = validateAndSanitizeSubmission({
    ...validServerPayload,
    wpm: 240,
    duration: 60,
  });
  assert("Rejects impossible speed (240 WPM on 60s test)", impossibleWpmResult.isValid === false);

  // C. Submission with zero keystrokes but positive WPM (fake payload injection)
  const zeroCharsResult = validateAndSanitizeSubmission({
    wpm: 120,
    rawWpm: 120,
    accuracy: 100,
    totalChars: 0,
    correctChars: 0,
    errorCount: 0,
    duration: 60,
  });
  assert("Rejects positive WPM without keystroke telemetry data", zeroCharsResult.isValid === false);

  // D. Discrepant keystroke characters vs reported WPM
  const mismatchWpmResult = validateAndSanitizeSubmission({
    wpm: 150,
    rawWpm: 150,
    accuracy: 100,
    totalChars: 300,
    correctChars: 300, // 300 chars in 60s is 60 WPM, but claimed 150
    errorCount: 0,
    duration: 60,
  });
  assert("Rejects WPM that disagrees with verified keystroke characters", mismatchWpmResult.isValid === false);

  // E. Gross WPM less than Net WPM
  const invertedGrossNetResult = validateAndSanitizeSubmission({
    wpm: 60,
    rawWpm: 30, // Gross < Net
    accuracy: 100,
    totalChars: 300,
    correctChars: 300,
    duration: 60,
  });
  assert("Rejects Gross WPM lower than Net WPM", invertedGrossNetResult.isValid === false);

  // F. Correct chars > total chars
  const excessCharsResult = validateAndSanitizeSubmission({
    wpm: 60,
    rawWpm: 60,
    accuracy: 100,
    totalChars: 250,
    correctChars: 300,
    duration: 60,
  });
  assert("Rejects correct chars exceeding total chars", excessCharsResult.isValid === false);

  // G. XSS Sanitization test
  console.log("\n--- 7. XSS & Payload Sanitization Tests ---");
  const xssName = '<script>alert("hacked")</script>EliteTypist';
  const sanitized = sanitizeText(xssName, 24);
  assert("Strips script tags and angle brackets from display names", !sanitized.includes("<") && !sanitized.includes(">") && sanitized.includes("EliteTypist"));

  const controlChars = "Hello\x00\x1F\x7FWorld";
  assert("Strips dangerous ASCII control characters", sanitizeText(controlChars) === "HelloWorld");

  console.log("\n==========================================");
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
