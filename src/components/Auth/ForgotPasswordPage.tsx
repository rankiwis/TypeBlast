import React, { useState } from "react";
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft, KeyRound, Clock, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SeoHead } from "../SEO/SeoHead";

interface ForgotPasswordPageProps {
  onNavigatePath: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigatePath }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [previewResetUrl, setPreviewResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter the email address associated with your account.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await forgotPassword(cleanEmail);
      setSuccessMessage(
        response.message || "If an account exists for this email, you will receive a password reset link shortly."
      );
      if (response.previewResetUrl) {
        setPreviewResetUrl(response.previewResetUrl);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      // Even if network or API error, maintain graceful user feedback
      setError(err.message || "Unable to process request right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <SeoHead
        title="Forgot Password | TypeBlast User Account"
        description="Request a secure password reset link for your TypeBlast typing account."
      />

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {!isSubmitted ? (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Reset Your Password</h1>
              <p className="text-xs text-slate-400">
                Enter your email address and we'll send you a secure link to create a new password.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email-input" className="text-xs font-bold text-slate-300">
                  Account Email Address
                </label>
                <div className="relative">
                  <input
                    id="forgot-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                    autoFocus
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  For your privacy and security, password reset links are single-use and expire after 1 hour.
                </span>
              </div>

              <button
                id="forgot-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Reset Link...</span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Check Your Email</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {successMessage}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-left space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Important Security Notes</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-300">
                <li>The link is valid for <strong>1 hour</strong> from now.</li>
                <li>Each link can only be used once to create a new password.</li>
                <li>Check your spam or promotions folder if you don't see it in a few minutes.</li>
              </ul>
            </div>

            {/* In preview or sandbox mode, provide direct test navigation */}
            {previewResetUrl && (
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] text-cyan-300 font-bold">
                  <span>⚡ Instant Preview Link (Development Mode)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click the link below to open the reset password screen directly:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const url = new URL(previewResetUrl, window.location.origin);
                      onNavigatePath(url.pathname + url.search);
                    } catch {
                      const tokenPart = previewResetUrl.split("?")[1] || "";
                      onNavigatePath(`/reset-password/?${tokenPart}`);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Reset Password Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                id="forgot-back-to-login-btn"
                onClick={() => onNavigatePath("/login/")}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Log In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setPreviewResetUrl(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors cursor-pointer"
              >
                Didn't receive an email? Try another address
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={() => onNavigatePath("/login/")}
            className="text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Log In</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePath("/signup/")}
            className="text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
