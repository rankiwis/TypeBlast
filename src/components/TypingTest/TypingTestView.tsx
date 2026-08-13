import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code,
  Quote,
  Hash,
  Type,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { TestDuration, TestCategory, TypingStats, TabType } from "../../types";
import { generateTestText } from "../../utils/textGenerator";
import { soundEngine } from "../../utils/sound";

interface TypingTestViewProps {
  onTestComplete: (stats: TypingStats) => void;
  setActiveTab: (tab: TabType) => void;
  isKidsMode?: boolean;
}

export const TypingTestView: React.FC<TypingTestViewProps> = ({
  onTestComplete,
  setActiveTab,
  isKidsMode = false,
}) => {
  const [duration, setDuration] = useState<TestDuration>(30);
  const [category, setCategory] = useState<TestCategory>("words");
  const [textToType, setTextToType] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Statistics tracking
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [finalStats, setFinalStats] = useState<TypingStats | null>(null);

  const [customTextModalOpen, setCustomTextModalOpen] = useState(false);
  const [customInputText, setCustomInputText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Generate new text text whenever category or duration changes
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newText = generateTestText(category, 60, isKidsMode);
    setTextToType(newText);
    setUserInput("");
    setTimeLeft(duration);
    setIsActive(false);
    setIsFinished(false);
    setWpmHistory([]);
    setErrorKeys({});
    setCorrectChars(0);
    setErrorCount(0);
    setFinalStats(null);
    startTimeRef.current = null;

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [category, duration, isKidsMode]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Finish test handler
  const completeTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsFinished(true);
    soundEngine.playFinishChime();

    const timeSpent = duration - timeLeft || duration;
    const minutes = timeSpent / 60 || 1 / 60;
    const finalWpm = Math.round((correctChars / 5) / minutes);
    const rawWpm = Math.round((userInput.length / 5) / minutes);
    const accuracy = userInput.length > 0
      ? Math.round((correctChars / userInput.length) * 100)
      : 100;
    const cpm = Math.round(correctChars / minutes);

    const stats: TypingStats = {
      wpm: finalWpm,
      rawWpm,
      accuracy,
      cpm,
      totalChars: userInput.length,
      correctChars,
      errorCount,
      timeElapsed: timeSpent,
      duration,
      timestamp: new Date().toLocaleTimeString(),
      errorKeys,
      wpmHistory: wpmHistory.length > 0 ? wpmHistory : [finalWpm],
    };

    setFinalStats(stats);
    onTestComplete(stats);
  }, [duration, timeLeft, correctChars, userInput.length, errorCount, errorKeys, wpmHistory, onTestComplete]);

  // Timer loop
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeTest();
            return 0;
          }
          const currentSpent = duration - (prev - 1);
          const currentMin = currentSpent / 60;
          const currentWpm = currentMin > 0 ? Math.round((correctChars / 5) / currentMin) : 0;
          setWpmHistory((hist) => [...hist, currentWpm]);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, duration, correctChars, completeTest]);

  // Handle typing key events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (isFinished) return;

    if (!isActive && val.length > 0) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    const lastCharTyped = val[val.length - 1];
    const targetChar = textToType[val.length - 1];

    if (val.length > userInput.length) {
      // Key added
      const isSpace = lastCharTyped === " ";
      if (lastCharTyped === targetChar) {
        setCorrectChars((prev) => prev + 1);
        soundEngine.playKeyPress(isSpace, false);
      } else {
        setErrorCount((prev) => prev + 1);
        if (targetChar) {
          setErrorKeys((prev) => ({
            ...prev,
            [targetChar.toLowerCase()]: (prev[targetChar.toLowerCase()] || 0) + 1,
          }));
        }
        soundEngine.playKeyPress(isSpace, true);
      }
    }

    setUserInput(val);

    // If reached end of text
    if (val.length >= textToType.length) {
      completeTest();
    }
  };

  // Keyboard shortcut listener for restart (Tab + Enter or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetTest();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetTest]);

  // Calculate live WPM
  const timeSpent = isActive ? duration - timeLeft : 0;
  const liveMinutes = timeSpent / 60;
  const liveWpm = liveMinutes > 0 ? Math.round((correctChars / 5) / liveMinutes) : 0;
  const liveAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Test Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
        {/* Category Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[
            { id: "words", label: "Words", icon: <Type className="w-3.5 h-3.5" /> },
            { id: "quotes", label: "Quotes", icon: <Quote className="w-3.5 h-3.5" /> },
            { id: "code", label: "Code", icon: <Code className="w-3.5 h-3.5" /> },
            { id: "numbers", label: "Numbers", icon: <Hash className="w-3.5 h-3.5" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id as TestCategory);
                soundEngine.playKeyPress();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                category === cat.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}

          <button
            onClick={() => setCustomTextModalOpen(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              category === "custom"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Custom
          </button>
        </div>

        {/* Duration Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
          {[15, 30, 60, 120].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDuration(d as TestDuration);
                soundEngine.playKeyPress();
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                duration === d
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {/* Typing Canvas Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`relative p-8 rounded-2xl bg-slate-900/60 border ${
          isActive ? "border-cyan-500/50 shadow-cyan-500/10" : "border-slate-800"
        } shadow-2xl transition-all min-h-[220px] flex flex-col justify-between cursor-text select-none overflow-hidden`}
        id="typing-canvas"
      >
        {/* Hidden Input for Capturing Typing */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isFinished}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />

        {/* Live Top Status Indicators */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-sm font-mono">
          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-cyan-400">{timeLeft}</span>
              <span className="text-xs text-slate-500 uppercase">Sec</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-200">{liveWpm}</span>
              <span className="text-xs text-slate-500 uppercase">WPM</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-emerald-400">{liveAccuracy}%</span>
              <span className="text-xs text-slate-500 uppercase">Acc</span>
            </div>
          </div>

          <button
            onClick={resetTest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            title="Restart Test (Esc)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (Esc)</span>
          </button>
        </div>

        {/* Text Area Display with Character Highlighting */}
        <div className="py-6 text-xl sm:text-2xl font-mono leading-relaxed tracking-wide text-slate-500 break-words font-medium">
          {textToType.split("").map((char, index) => {
            let stateClass = "text-slate-600";
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;

            if (isTyped) {
              const isCorrect = userInput[index] === char;
              stateClass = isCorrect
                ? "text-slate-100 font-semibold"
                : "text-rose-400 bg-rose-500/20 underline decoration-rose-500 rounded-sm";
            }

            return (
              <span
                key={index}
                className={`relative transition-colors duration-75 ${stateClass} ${
                  isCurrent ? "bg-cyan-500/20 text-cyan-200 border-b-2 border-cyan-400 animate-pulse" : ""
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Bottom Helper Instruction */}
        {!isActive && !isFinished && (
          <div className="text-center text-xs text-slate-500 font-sans tracking-wide">
            💡 Click anywhere or start typing to begin the speed test
          </div>
        )}
      </div>

      {/* Post-Test Analytical Modal / Results Dashboard */}
      {isFinished && finalStats && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Test Complete!</h3>
                <p className="text-xs text-slate-400">Here is your speed & accuracy breakdown</p>
              </div>
            </div>

            <button
              onClick={resetTest}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>

          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Typing Speed</div>
              <div className="text-4xl font-extrabold text-cyan-400 font-mono">{finalStats.wpm}</div>
              <div className="text-[10px] text-slate-400 mt-1">Raw: {finalStats.rawWpm} WPM</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Accuracy</div>
              <div className="text-4xl font-extrabold text-emerald-400 font-mono">{finalStats.accuracy}%</div>
              <div className="text-[10px] text-slate-400 mt-1">{finalStats.correctChars} / {finalStats.totalChars} chars</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Characters/Min</div>
              <div className="text-4xl font-extrabold text-blue-400 font-mono">{finalStats.cpm}</div>
              <div className="text-[10px] text-slate-400 mt-1">CPM speed</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-xs text-slate-500 font-medium uppercase mb-1">Mistypes</div>
              <div className="text-4xl font-extrabold text-rose-400 font-mono">{finalStats.errorCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">{Object.keys(finalStats.errorKeys).length} unique error keys</div>
            </div>
          </div>

          {/* Error Heatmap Breakdown */}
          {Object.keys(finalStats.errorKeys).length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Mistyped Key Heatmap</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(finalStats.errorKeys).map(([key, count]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono"
                  >
                    <span className="font-bold uppercase">{key === " " ? "SPACE" : key}</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[10px]">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call-To-Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveTab("aicoach")}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Diagnose Weakness with AI Coach</span>
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Claim Speed Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* Custom Text Modal */}
      {customTextModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-cyan-400" />
              <span>Custom Typing Text</span>
            </h3>
            <textarea
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="Paste your custom text or code here to practice..."
              rows={5}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm font-mono focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setCustomTextModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customInputText.trim()) {
                    setTextToType(customInputText.trim());
                    setCategory("custom");
                    setUserInput("");
                    setCustomTextModalOpen(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
              >
                Apply Custom Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
