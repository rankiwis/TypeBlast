import React, { useState } from "react";
import { Smile, Star, Rocket, Trophy, Sparkles, Heart } from "lucide-react";
import { soundEngine } from "../../utils/sound";
import { KIDS_WORDS } from "../../utils/textGenerator";

export const KidsView: React.FC = () => {
  const [kidsInput, setKidsInput] = useState("");
  const [stars, setStars] = useState(12);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  const currentWord = KIDS_WORDS[currentWordIdx % KIDS_WORDS.length];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setKidsInput(e.target.value);
    soundEngine.playKeyPress();

    if (val === currentWord) {
      soundEngine.playLaserShot();
      setStars((s) => s + 1);
      setCurrentWordIdx((i) => i + 1);
      setKidsInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Playful Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border-2 border-amber-400/40 shadow-2xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Smile className="w-8 h-8 text-amber-400 animate-bounce" />
            <h2 className="text-3xl font-black text-amber-300">TypeBlast Junior! 🌟</h2>
          </div>
          <p className="text-xs text-slate-300 font-bold">Fun typing adventures for young learners!</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-lg">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{stars} Stars</span>
        </div>
      </div>

      {/* Fun Word Card */}
      <div className="p-10 rounded-3xl bg-slate-900 border-4 border-amber-400/30 text-center space-y-6 shadow-2xl">
        <div className="text-xs uppercase font-black tracking-widest text-amber-400">Type the Magic Word!</div>
        <div className="text-6xl font-black font-mono text-cyan-300 tracking-wider uppercase drop-shadow-md">
          {currentWord}
        </div>

        <input
          type="text"
          value={kidsInput}
          onChange={handleInput}
          placeholder="Type here..."
          autoFocus
          className="max-w-md w-full p-4 bg-slate-950 border-2 border-amber-400/50 rounded-2xl text-center text-2xl font-mono font-bold text-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-400/30"
        />

        <div className="flex items-center justify-center gap-6 text-2xl pt-2">
          <span>🚀</span>
          <span>🐱</span>
          <span>⭐</span>
          <span>🌈</span>
          <span>🍦</span>
        </div>
      </div>
    </div>
  );
};
