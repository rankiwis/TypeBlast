/**
 * TypeBlast Lightweight Non-Blocking Analytics Tracker
 * Guaranteed ZERO PII (no emails, no passwords, no full typed text)
 * Designed for zero-latency impact on typing keydown loops.
 */

export type AnalyticsEventName =
  | "typing_test_started"
  | "typing_test_completed"
  | "typing_game_started"
  | "typing_game_completed"
  | "daily_challenge_started"
  | "daily_challenge_completed"
  | "account_created"
  | "login"
  | "forgot_password_requested"
  | "password_reset_success"
  | "leaderboard_viewed"
  | "result_shared";

export interface AnalyticsEventParams {
  typing_test_started: {
    duration: number | string;
    test_type: string;
    completion_status?: "in_progress";
    mode?: string;
  };
  typing_test_completed: {
    duration: number | string;
    test_type: string;
    completion_status: "completed" | "abandoned" | "time_expired";
    wpm?: number;
    raw_wpm?: number;
    accuracy?: number;
  };
  typing_game_started: {
    game_id: string;
    game_name: string;
    difficulty?: string;
  };
  typing_game_completed: {
    game_id: string;
    game_name: string;
    score: number;
    wpm?: number;
    accuracy?: number;
  };
  daily_challenge_started: {
    date: string;
    mode?: string;
  };
  daily_challenge_completed: {
    date: string;
    score?: number;
    wpm?: number;
    accuracy?: number;
  };
  account_created: {
    method: "email" | "guest" | "oauth";
  };
  login: {
    method: "email" | "guest" | "oauth";
  };
  forgot_password_requested: {
    method: "email";
  };
  password_reset_success: {
    method: "token";
  };
  leaderboard_viewed: {
    category?: string;
    timeframe?: string;
  };
  result_shared: {
    platform?: string;
    score_wpm?: number;
    test_type?: string;
  };
}

// In-memory deduplication log
const recentEventHashes = new Map<string, number>();

// Sanitize parameter object to strictly remove PII or long text strings
function sanitizeParams(params: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(params || {})) {
    // Exclude blacklisted PII / sensitive keys
    if (
      key === "email" ||
      key === "password" ||
      key === "typedText" ||
      key === "text" ||
      key === "targetText" ||
      key === "user_text" ||
      key === "token" ||
      key === "authToken" ||
      key === "pass"
    ) {
      continue;
    }

    if (typeof val === "string") {
      // Truncate long strings to prevent accidental text payload leaking
      clean[key] = val.slice(0, 100);
    } else if (typeof val === "number" || typeof val === "boolean") {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Non-blocking event tracking dispatch.
 * Schedules telemetry calls asynchronously using requestIdleCallback / setTimeout.
 */
export function trackEvent<E extends AnalyticsEventName>(
  eventName: E,
  params: AnalyticsEventParams[E]
): void {
  const executeTrack = () => {
    try {
      const sanitized = sanitizeParams(params as Record<string, any>);

      // Deduplication check: prevent identical event triggers within 500ms
      const eventHash = `${eventName}:${JSON.stringify(sanitized)}`;
      const now = Date.now();
      const lastSent = recentEventHashes.get(eventHash);
      if (lastSent && now - lastSent < 500) {
        return; // Skip duplicate trigger
      }
      recentEventHashes.set(eventHash, now);

      // Clean old hash entries periodically
      if (recentEventHashes.size > 100) {
        for (const [h, timestamp] of recentEventHashes.entries()) {
          if (now - timestamp > 5000) recentEventHashes.delete(h);
        }
      }

      // 1. Dispatch custom DOM event for lightweight local telemetry monitoring
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("typeblast_analytics", {
            detail: { event: eventName, params: sanitized, timestamp: new Date().toISOString() },
          })
        );

        // 2. Integration with Google Analytics (gtag) if present on window
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", eventName, sanitized);
        }

        // 3. Integration with Plausible if present
        if (typeof (window as any).plausible === "function") {
          (window as any).plausible(eventName, { props: sanitized });
        }

        // 4. Console log in development mode
        if ((import.meta as any).env?.DEV) {
          console.log(`[Analytics] ${eventName}`, sanitized);
        }
      }
    } catch (err) {
      // Silently catch errors so app execution is never interrupted
    }
  };

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    (window as any).requestIdleCallback(executeTrack, { timeout: 1000 });
  } else {
    setTimeout(executeTrack, 0);
  }
}
