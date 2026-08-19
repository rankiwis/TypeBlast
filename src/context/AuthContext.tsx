import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TypingStats } from "../types";
import { trackEvent } from "../utils/analytics";

export interface UserTestResult {
  id: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  totalChars: number;
  correctChars: number;
  errorCount: number;
  duration: number;
  category: string;
  timestamp: string;
}

export interface UserGameScore {
  gameId: string;
  gameName: string;
  score: number;
  wpm: number;
  accuracy: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  displayName?: string;
  bio?: string;
  keyboardLayout?: string;
  soundPreference?: string;
  
  personalBestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
  currentStreak: number;
  lastTestDate: string | null;
  xp: number;

  testHistory: UserTestResult[];
  gameScores: UserGameScore[];
  achievements: Achievement[];
}

interface AuthContextType {
  user: UserAccount | null;
  token: string | null;
  isLoading: boolean;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; previewResetUrl?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ message: string }>;
  recordTestResult: (stats: TypingStats) => Promise<void>;
  recordGameScore: (gameId: string, gameName: string, score: number, wpm: number, accuracy: number) => Promise<void>;
  updateProfile: (data: { displayName?: string; bio?: string; keyboardLayout?: string; soundPreference?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "typeblast_auth_token";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function parseJsonResponse(res: Response, defaultErrorMsg: string) {
    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response (e.g. 502, 503 or HTML gateway error)
      if (!res.ok) {
        throw new Error(`Server temporarily unavailable (${res.status}). Please try again in a few seconds.`);
      }
      throw new Error("Received unexpected response format from server.");
    }

    if (!res.ok) {
      throw new Error(data?.error || defaultErrorMsg);
    }

    return data;
  }

  // Fetch logged in user profile on initial load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const signup = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await parseJsonResponse(res, "Failed to create account.");

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    trackEvent("account_created", { method: "email" });
  };

  const login = async (emailOrUsername: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await parseJsonResponse(res, "Invalid username/email or password.");

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    trackEvent("login", { method: "email" });
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.error("Logout error:", e);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await parseJsonResponse(
      res,
      "If an account exists for this email, you will receive a password reset link shortly."
    );
    trackEvent("forgot_password_requested", { method: "email" });
    return {
      message: data.message || "If an account exists for this email, you will receive a password reset link shortly.",
      previewResetUrl: data.previewResetUrl,
    };
  };

  const resetPassword = async (resetToken: string, password: string) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, password }),
    });

    const data = await parseJsonResponse(res, "Failed to reset password.");
    trackEvent("password_reset_success", { method: "token" });
    return {
      message: data.message || "Your password has been reset successfully.",
    };
  };

  const recordTestResult = async (stats: TypingStats) => {
    if (!token) return;

    try {
      const res = await fetch("/api/user/test-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wpm: stats.wpm,
          rawWpm: stats.rawWpm,
          accuracy: stats.accuracy,
          cpm: stats.cpm,
          totalChars: stats.totalChars,
          correctChars: stats.correctChars,
          errorCount: stats.errorCount,
          duration: stats.duration,
          category: stats.completedWords ? "words" : "standard",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error("Failed to record test result to server:", e);
    }
  };

  const recordGameScore = async (
    gameId: string,
    gameName: string,
    score: number,
    wpm: number,
    accuracy: number
  ) => {
    if (!token) return;

    try {
      const res = await fetch("/api/user/game-scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId, gameName, score, wpm, accuracy }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error("Failed to record game score:", e);
    }
  };

  const updateProfile = async (data: {
    displayName?: string;
    bio?: string;
    keyboardLayout?: string;
    soundPreference?: string;
  }) => {
    if (!token) return;

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await parseJsonResponse(res, "Failed to update profile.");
    setUser(resData.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
        recordTestResult,
        recordGameScore,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
