import React, { useState } from "react";
import { Lock, Mail, Key, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SeoHead } from "../SEO/SeoHead";

interface LoginPageProps {
  onNavigatePath: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigatePath }) => {
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailOrUsername.trim() || !password) {
      setError("Please enter your email/username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(emailOrUsername, password);
      onNavigatePath("/dashboard/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <SeoHead
        title="Log In | TypeBlast User Account"
        description="Log in to your TypeBlast account to sync typing test histories, view personal WPM records, and track daily streaks."
      />

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Log In to TypeBlast</h1>
          <p className="text-xs text-slate-400">Access your typing history, performance graphs, and achievements.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Email or Username</label>
            <div className="relative">
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="you@example.com or username"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
              <Mail className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <button
                type="button"
                id="login-forgot-password-link"
                onClick={() => onNavigatePath("/forgot-password/")}
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
              <Key className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => onNavigatePath("/signup/")}
            className="text-cyan-400 font-bold hover:underline"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </div>
  );
};
