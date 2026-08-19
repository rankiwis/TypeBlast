import React, { useState, useEffect } from "react";
import {
  Lock,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SeoHead } from "../SEO/SeoHead";

interface ResetPasswordPageProps {
  onNavigatePath: (path: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigatePath }) => {
  const { resetPassword } = useAuth();

  // Extract token from window URL query or search
  const [token, setToken] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("token") || "";
    }
    return "";
  });

  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [associatedEmail, setAssociatedEmail] = useState<string>("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify token on mount or when token changes
  useEffect(() => {
    let currentToken = token;
    if (!currentToken && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      currentToken = urlParams.get("token") || "";
      setToken(currentToken);
    }

    if (!currentToken) {
      setIsVerifying(false);
      setTokenValid(false);
      setTokenError("No password reset token was found in the link.");
      return;
    }

    const verifyTokenOnServer = async () => {
      setIsVerifying(true);
      setTokenError(null);

      try {
        const res = await fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(currentToken)}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setTokenValid(true);
          setAssociatedEmail(data.email || "");
        } else {
          setTokenValid(false);
          setTokenError(data.error || "This password reset link is invalid or has expired.");
        }
      } catch (err: any) {
        setTokenValid(false);
        setTokenError("Unable to verify reset token at this time. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyTokenOnServer();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password.length > 128) {
      setError("Password cannot exceed 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password validation indicators
  const hasMinLength = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <SeoHead
        title="Set New Password | TypeBlast"
        description="Choose a secure new password for your TypeBlast account."
      />

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Loading / Verification State */}
        {isVerifying && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Verifying Reset Link</h2>
              <p className="text-xs text-slate-400">Please wait while we check your secure token...</p>
            </div>
          </div>
        )}

        {/* Invalid or Expired Token State */}
        {!isVerifying && !tokenValid && !isSuccess && (
          <div className="py-4 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Link Expired or Invalid</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {tokenError || "This password reset link has expired, is malformed, or has already been used."}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
              <p className="font-semibold text-slate-300">Why might this happen?</p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Password reset links automatically expire after 1 hour.</li>
                <li>The link can only be used once.</li>
                <li>A newer password reset request may have been generated.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                id="reset-request-new-link-btn"
                onClick={() => onNavigatePath("/forgot-password/")}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Request New Reset Link</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigatePath("/login/")}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Log In</span>
              </button>
            </div>
          </div>
        )}

        {/* Successful Reset State */}
        {!isVerifying && isSuccess && (
          <div className="py-4 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Password Reset Complete!</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Your password has been successfully updated. Your account is now secured with your new password.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                All active sessions have been securely refreshed. You can now log in to continue typing.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="reset-success-login-btn"
                onClick={() => onNavigatePath("/login/")}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>Log In Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Valid Token Form State */}
        {!isVerifying && tokenValid && !isSuccess && (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Create New Password</h1>
              <p className="text-xs text-slate-400">
                {associatedEmail
                  ? `Choose a new password for ${associatedEmail}`
                  : "Please enter and confirm your new password below."}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="new-password-input" className="text-xs font-bold text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-new-password-input" className="text-xs font-bold text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-new-password-input"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirement Checklist */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                      hasMinLength
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {hasMinLength ? "✓" : "•"}
                  </div>
                  <span className={hasMinLength ? "text-emerald-400 font-medium" : "text-slate-400"}>
                    At least 6 characters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                      passwordsMatch
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {passwordsMatch ? "✓" : "•"}
                  </div>
                  <span className={passwordsMatch ? "text-emerald-400 font-medium" : "text-slate-400"}>
                    Passwords match
                  </span>
                </div>
              </div>

              <button
                id="reset-submit-btn"
                type="submit"
                disabled={isSubmitting || !hasMinLength || !passwordsMatch}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Saving New Password...</span>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              <button
                type="button"
                onClick={() => onNavigatePath("/login/")}
                className="text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel and Back to Log In</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
