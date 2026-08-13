import React, { useState } from "react";
import { User, Mail, ShieldCheck, Settings, Save, LogOut, Check, Keyboard, Volume2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SeoHead } from "../SEO/SeoHead";

interface ProfilePageProps {
  onNavigatePath: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigatePath }) => {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [keyboardLayout, setKeyboardLayout] = useState(user?.keyboardLayout || "QWERTY");
  const [soundPreference, setSoundPreference] = useState(user?.soundPreference || "mechanical");

  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <SeoHead title="User Profile | TypeBlast" description="Manage your TypeBlast user account and preferences." />
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <User className="w-12 h-12 text-slate-500 mx-auto" />
          <h1 className="text-2xl font-black text-white">Profile Access Restricted</h1>
          <p className="text-xs text-slate-400">Please log in to manage your account settings and preferences.</p>
          <button
            onClick={() => onNavigatePath("/login/")}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await updateProfile({ displayName, bio, keyboardLayout, soundPreference });
      setMessage("Profile settings saved successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage("Failed to update profile: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigatePath("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <SeoHead
        title={`${user.displayName || user.username}'s Profile | TypeBlast`}
        description="TypeBlast user account profile settings, preferences, and security settings."
      />

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        {/* Header Profile Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black text-2xl flex items-center justify-center uppercase">
              {user.username.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{user.displayName || user.username}</h1>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                  Member
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">@{user.username} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Info (Read-Only Security Fields) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Account Security</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 font-medium">Username</label>
                  <div className="font-mono text-slate-200 mt-0.5">@{user.username}</div>
                </div>

                <div>
                  <label className="text-slate-500 font-medium">Private Email Address</label>
                  <div className="font-mono text-slate-200 mt-0.5">{user.email} (Kept Private)</div>
                </div>

                <div>
                  <label className="text-slate-500 font-medium">Account ID</label>
                  <div className="font-mono text-slate-500 text-[10px] mt-0.5">{user.id}</div>
                </div>
              </div>
            </div>

            {/* Display Profile Customization */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Public Display Profile</span>
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. SpeedDemon99"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Bio / Tagline</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Grid */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-purple-400" />
              <span>Typing Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Keyboard Layout</label>
                <select
                  value={keyboardLayout}
                  onChange={(e) => setKeyboardLayout(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="QWERTY">QWERTY Standard</option>
                  <option value="DVORAK">DVORAK Simplified</option>
                  <option value="COLEMAK">COLEMAK Ergonomic</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Default Key Sound Profile</label>
                <select
                  value={soundPreference}
                  onChange={(e) => setSoundPreference(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="mechanical">Cherry MX Blue Mechanical</option>
                  <option value="soft">Soft Membrane Silent</option>
                  <option value="typewriter">Retro Typewriter Chime</option>
                  <option value="muted">Muted (No Audio)</option>
                </select>
              </div>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
