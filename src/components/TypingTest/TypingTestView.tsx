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
  BarChart3,
  Gamepad2,
  Trophy,
  ChevronDown,
  ChevronUp,
  Flame,
  Target,
  ShieldCheck,
  Users,
  HelpCircle,
  Play,
  ArrowRight,
  Brain,
  Keyboard,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  CheckCircle
} from "lucide-react";
import { TestDuration, TestCategory, TypingStats, TabType } from "../../types";
import { generateTestText } from "../../utils/textGenerator";
import { soundEngine } from "../../utils/sound";
import {
  calculateWpm,
  calculateGrossWpm,
  calculateAccuracy,
  calculateCpm,
  calculateCompletedWords,
  validateTestResult,
  calculateCharacterCounts,
} from "../../utils/typingCalculator";
import { trackEvent } from "../../utils/analytics";

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
  const [isScoreValidated, setIsScoreValidated] = useState<boolean>(true);

  // Personal Best from localStorage
  const [personalBest, setPersonalBest] = useState<number>(() => {
    const saved = localStorage.getItem("typeblast_pb");
    return saved ? parseInt(saved, 10) || 0 : 0;
  });

  // Modal States
  const [customTextModalOpen, setCustomTextModalOpen] = useState(false);
  const [customInputText, setCustomInputText] = useState("");
  const [customDurationModalOpen, setCustomDurationModalOpen] = useState(false);
  const [customDurationInput, setCustomDurationInput] = useState("45");

  // Share Feedback State
  const [shareCopied, setShareCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const typingCanvasRef = useRef<HTMLDivElement>(null);

  // Helper to generate passage based on duration and category
  const generatePassage = useCallback(
    (dur: number, cat: TestCategory) => {
      // Scale passage length to prevent running out of text on long 3-minute / custom tests
      const wordCount = Math.max(50, Math.ceil(dur * 2.5));
      return generateTestText(cat, wordCount, isKidsMode);
    },
    [isKidsMode]
  );

  // Reset test state (new test or try again)
  const resetTest = useCallback(
    (preserveSameText: boolean = false) => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      if (!preserveSameText) {
        const newText = generatePassage(duration, category);
        setTextToType(newText);
      }

      setUserInput("");
      setTimeLeft(duration);
      setIsActive(false);
      setIsFinished(false);
      setWpmHistory([]);
      setErrorKeys({});
      setCorrectChars(0);
      setErrorCount(0);
      setFinalStats(null);
      setIsScoreValidated(true);
      startTimeRef.current = null;

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    },
    [category, duration, generatePassage]
  );

  // Generate test text when category or duration changes
  useEffect(() => {
    resetTest(false);
  }, [category, duration, resetTest]);

  // Finish test handler with standard calculation and anti-tamper score validation
  const completeTest = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsActive(false);
    setIsFinished(true);
    soundEngine.playFinishChime();

    const elapsedSeconds = startTimeRef.current
      ? Math.min(duration, Math.max(0.1, (performance.now() - startTimeRef.current) / 1000))
      : duration;

    const deterministicCounts = calculateCharacterCounts(userInput, textToType);
    const calculatedCorrectChars = deterministicCounts.correctChars;
    const finalWpm = calculateWpm(calculatedCorrectChars, elapsedSeconds);
    const rawWpm = calculateGrossWpm(userInput.length, elapsedSeconds);
    const accuracy = calculateAccuracy(calculatedCorrectChars, userInput.length);
    const cpm = calculateCpm(calculatedCorrectChars, elapsedSeconds);
    const completedWords = calculateCompletedWords(userInput, textToType);

    const statsPayload: TypingStats = {
      wpm: finalWpm,
      rawWpm,
      accuracy,
      cpm,
      totalChars: userInput.length,
      correctChars: calculatedCorrectChars,
      errorCount,
      completedWords,
      timeElapsed: Math.round(elapsedSeconds),
      duration,
      timestamp: new Date().toLocaleTimeString(),
      errorKeys,
      wpmHistory: wpmHistory.length > 0 ? wpmHistory : [finalWpm],
    };

    // Validate score before storing / publishing
    const validation = validateTestResult({
      wpm: finalWpm,
      rawWpm,
      accuracy,
      duration,
      timeElapsed: elapsedSeconds,
      totalChars: userInput.length,
      correctChars: calculatedCorrectChars,
      errorCount,
    });

    setIsScoreValidated(validation.isValid);

    if (validation.isValid) {
      // Update Personal Best if higher
      if (finalWpm > personalBest) {
        setPersonalBest(finalWpm);
        localStorage.setItem("typeblast_pb", finalWpm.toString());
      }
      onTestComplete(statsPayload);
    }

    setFinalStats(statsPayload);

    trackEvent("typing_test_completed", {
      duration: duration,
      test_type: `${duration}s_${category}`,
      completion_status: "completed",
      wpm: finalWpm,
      raw_wpm: rawWpm,
      accuracy: accuracy,
    });
  }, [
    duration,
    userInput,
    textToType,
    errorCount,
    errorKeys,
    wpmHistory,
    personalBest,
    onTestComplete,
  ]);

  // Precision Timer loop using performance.now() to eliminate timer drift
  useEffect(() => {
    if (isActive && !isFinished) {
      let lastRecordedSecond = 0;

      timerIntervalRef.current = setInterval(() => {
        if (!startTimeRef.current) return;

        const now = performance.now();
        const elapsedSeconds = (now - startTimeRef.current) / 1000;
        const remainingSeconds = Math.max(0, duration - elapsedSeconds);

        setTimeLeft(Math.ceil(remainingSeconds));

        // Sample WPM every full second
        const fullSecs = Math.floor(elapsedSeconds);
        if (fullSecs > lastRecordedSecond && elapsedSeconds > 0) {
          lastRecordedSecond = fullSecs;
          const currentLiveWpm = calculateWpm(correctChars, elapsedSeconds);
          setWpmHistory((hist) => [...hist, currentLiveWpm]);
        }

        // Stop test EXACTLY at duration
        if (elapsedSeconds >= duration) {
          completeTest();
        }
      }, 50);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, isFinished, duration, correctChars, completeTest]);

  // Handle typing key events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (isFinished) return;

    // Start timer on first character typed
    if (!isActive && val.length > 0) {
      setIsActive(true);
      startTimeRef.current = performance.now();
      trackEvent("typing_test_started", {
        duration: duration,
        test_type: `${duration}s_${category}`,
        completion_status: "in_progress",
        mode: category,
      });
    }

    const lastCharTyped = val[val.length - 1];
    const targetChar = textToType[val.length - 1];

    const currentCounts = calculateCharacterCounts(val, textToType);
    setCorrectChars(currentCounts.correctChars);

    if (val.length > userInput.length) {
      // Character added
      const isSpace = lastCharTyped === " ";
      if (lastCharTyped === targetChar) {
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
    } else if (val.length < userInput.length) {
      // Backspace pressed
      soundEngine.playKeyPress(false, false);
    }

    setUserInput(val);

    // If user reached the very end of textToType
    if (val.length >= textToType.length && textToType.length > 0) {
      completeTest();
    }
  };

  // Keyboard shortcut listener for restart (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetTest(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetTest]);

  // Scroll and focus typing canvas
  const handleStartTypingClick = () => {
    typingCanvasRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  // Live Stats calculations
  const liveElapsed = isActive && startTimeRef.current
    ? Math.max(0.1, (performance.now() - startTimeRef.current) / 1000)
    : 0;

  const liveWpm = liveElapsed > 0 ? calculateWpm(correctChars, liveElapsed) : 0;
  const liveAccuracy = calculateAccuracy(correctChars, userInput.length);
  const liveCompletedWords = calculateCompletedWords(userInput, textToType);
  const progressPercent = textToType.length > 0
    ? Math.min(100, Math.round((userInput.length / textToType.length) * 100))
    : 0;

  // Social Share string
  const handleShareResult = () => {
    if (!finalStats) return;
    const shareText = `⚡ TypeBlast Speed Test: ${finalStats.wpm} WPM with ${finalStats.accuracy}% Accuracy on ${duration}s test! Can you beat my score? https://TypeBlast.com`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
      trackEvent("result_shared", {
        platform: "clipboard",
        score_wpm: finalStats.wpm,
        test_type: `${duration}s_${category}`,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-16">
      {/* ABOVE THE FOLD HERO SECTION */}
      <section className="text-center space-y-6 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/5">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Fast, Free & Accurate Typing Platform</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-[1.1]">
            Test Your Typing Speed. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">Get Faster.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Take a free typing speed test, practice your keyboard skills, and challenge yourself with fun typing games.
          </p>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleStartTypingClick}
            className="px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Typing Test</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("games");
              soundEngine.playKeyPress();
            }}
            className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-extrabold text-sm flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
          >
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span>Play Typing Games</span>
          </button>
        </div>

        {/* Highlight Metrics Bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-cyan-400 font-black text-lg">Instant WPM</div>
            <div className="text-[11px] text-slate-400 font-medium">Real-Time Precision</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-amber-400 font-black text-lg">15s - 180s+</div>
            <div className="text-[11px] text-slate-400 font-medium">Flexible Durations</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-purple-400 font-black text-lg">AI Coach</div>
            <div className="text-[11px] text-slate-400 font-medium">Keystroke Diagnostics</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-emerald-400 font-black text-lg">PB: {personalBest} WPM</div>
            <div className="text-[11px] text-slate-400 font-medium">Personal Best</div>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE TYPING TEST WIDGET */}
      <div ref={typingCanvasRef} className="space-y-4">
        {/* Top Test Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          {/* Category Controls */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
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
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
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
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Custom Passage
            </button>
          </div>

          {/* Duration Controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
            {[
              { label: "15s", val: 15 },
              { label: "30s", val: 30 },
              { label: "60s", val: 60 },
              { label: "3m", val: 180 },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => {
                  setDuration(d.val);
                  soundEngine.playKeyPress();
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                  duration === d.val
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d.label}
              </button>
            ))}

            <button
              onClick={() => setCustomDurationModalOpen(true)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1 ${
                ![15, 30, 60, 180].includes(duration as number)
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>{![15, 30, 60, 180].includes(duration as number) ? `${duration}s` : "Custom"}</span>
            </button>
          </div>
        </div>

        {/* Typing Canvas Area */}
        <div
          onClick={() => inputRef.current?.focus()}
          className={`relative p-6 sm:p-8 rounded-2xl bg-slate-900/90 border ${
            isActive ? "border-cyan-500/50 shadow-cyan-500/10" : "border-slate-800"
          } shadow-2xl transition-all min-h-[230px] flex flex-col justify-between cursor-text select-none overflow-hidden`}
          id="typing-canvas"
        >
          {/* Progress Bar Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

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
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 text-sm font-mono gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-cyan-400 font-mono">{timeLeft}</span>
                <span className="text-xs text-slate-500 uppercase">Sec</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-100 font-mono">{liveWpm}</span>
                <span className="text-xs text-slate-500 uppercase">WPM</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-emerald-400 font-mono">{liveAccuracy}%</span>
                <span className="text-xs text-slate-500 uppercase">Acc</span>
              </div>
              <div className="hidden sm:flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-300 font-mono">{liveCompletedWords}</span>
                <span className="text-xs text-slate-500 uppercase">Words</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => resetTest(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Restart Same Passage"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>

              <button
                onClick={() => resetTest(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Generate New Passage (Esc)"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Passage (Esc)</span>
              </button>
            </div>
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
                    isCurrent ? "bg-cyan-500/30 text-cyan-100 border-b-2 border-cyan-400 animate-pulse font-bold" : ""
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Bottom Helper Instruction */}
          {!isActive && !isFinished && (
            <div className="text-center text-xs text-slate-400 font-sans tracking-wide flex items-center justify-center gap-2">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>Click anywhere or press any key to begin typing test</span>
            </div>
          )}
        </div>

        {/* POST-TEST RESULTS SCREEN */}
        {isFinished && finalStats && (
          <div
            role="status"
            aria-live="polite"
            aria-label="Typing test completed results summary"
            className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200"
          >
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white">Test Completed!</h3>
                    {isScoreValidated ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3" />
                        <span>Score Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Flagged Entry</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Detailed breakdown for {duration}-second test</p>
                </div>
              </div>

              {/* Top Result Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => resetTest(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={() => resetTest(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Test</span>
                </button>

                <button
                  onClick={handleShareResult}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{shareCopied ? "Copied!" : "Share Result"}</span>
                </button>
              </div>
            </div>

            {/* Key Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Net WPM</div>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">{finalStats.wpm}</div>
                <div className="text-[10px] text-slate-400 mt-1">Raw: {finalStats.rawWpm}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Accuracy</div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">{finalStats.accuracy}%</div>
                <div className="text-[10px] text-slate-400 mt-1">{finalStats.correctChars}/{finalStats.totalChars} chars</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Correct Chars</div>
                <div className="text-3xl font-extrabold text-slate-200 font-mono">{finalStats.correctChars}</div>
                <div className="text-[10px] text-slate-400 mt-1">Valid keyhits</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Incorrect Chars</div>
                <div className="text-3xl font-extrabold text-rose-400 font-mono">{finalStats.errorCount}</div>
                <div className="text-[10px] text-slate-400 mt-1">Mistypes</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Completed Words</div>
                <div className="text-3xl font-extrabold text-blue-400 font-mono">{finalStats.completedWords || 0}</div>
                <div className="text-[10px] text-slate-400 mt-1">Full words</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Personal Best</div>
                <div className="text-3xl font-extrabold text-amber-400 font-mono">{personalBest}</div>
                <div className="text-[10px] text-slate-400 mt-1">All-time WPM</div>
              </div>
            </div>

            {/* Error Heatmap Breakdown */}
            {Object.keys(finalStats.errorKeys).length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Mistyped Key Matrix</span>
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

            {/* Secondary CTA buttons */}
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
      </div>

      {/* HOMEPAGE SECTION 1: TYPING SPEED TEST */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Speed Testing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Free Online Typing Speed Test</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Measure your net WPM (Words Per Minute), accuracy percentage, and raw keystroke velocity across flexible time intervals and content categories.
            </p>
          </div>

          <button
            onClick={handleStartTypingClick}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-2"
          >
            <span>Take Speed Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              <Type className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Standard Words</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated top English words designed to benchmark baseline touch typing speed and finger muscle memory.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Famous Quotes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspirational literature passages with punctuation and capitalization to test real-world typing conditions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Programming Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Code snippets featuring brackets, symbols, indentation, and syntax for software developers and engineers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Hash className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Numbers & Symbols</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeted number rows and special character combinations for accounting, data entry, and finance specialists.
            </p>
          </div>
        </div>
      </section>

      {/* HOMEPAGE SECTION 2: TYPING PRACTICE */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Keyboard & Finger Maps</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Master Touch Typing Skills</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Build proper muscle memory with visual finger placement guides, interactive keyboard heatmaps, and customizable practice drills tailored to your unique error patterns.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab("practice");
                  soundEngine.playKeyPress();
                }}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 mx-auto md:mx-0"
              >
                <span>Launch Practice Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-slate-200">Home Row Mastery</div>
              <div className="text-[11px] text-slate-400">ASDF JKL; positioning</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-slate-200">Finger Color Maps</div>
              <div className="text-[11px] text-slate-400">Pinky to Index tracking</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-slate-200">Custom Text Drills</div>
              <div className="text-[11px] text-slate-400">Paste your own text</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-slate-200">Error Heatmaps</div>
              <div className="text-[11px] text-slate-400">Identify slow reaches</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOMEPAGE SECTION 3: TYPING GAMES */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Arcade Games Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Fun & Addictive Typing Games</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Turn speed practice into play with arcade games designed to test reflexes, laser precision, and fast decision-making.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab("games");
              soundEngine.playKeyPress();
            }}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <span>Play All Games</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xl">
                ⚡
              </div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">Arcade</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Speed Blast Laser</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shoot down incoming words with laser precision before they hit your defense shield.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xl">
                🏎️
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded">Action</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Nitro Typing Race</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                4-lane vehicle racing simulator where typing speed directly drives motor acceleration against AI racers.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl">
                🛡️
              </div>
              <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded">Survival</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Word Defense Arena</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Defend your base against waves of fast-approaching words across escalating difficulty tiers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOMEPAGE SECTION 4: DAILY CHALLENGE */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Typing Sprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Daily Typing Challenges & Streaks</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Complete today's official challenge text to maintain your daily streak, unlock special badges, and earn XP multipliers!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[140px]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Streak</div>
              <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>7 Days</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab("daily");
                soundEngine.playKeyPress();
              }}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 whitespace-nowrap"
            >
              <Trophy className="w-4 h-4" />
              <span>Launch Today's Challenge</span>
            </button>
          </div>
        </div>
      </section>

      {/* HOMEPAGE SECTION 5: LEADERBOARD */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Global Rankings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Global TypeBlast Leaderboard</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Compare your WPM record against top verified speed typists across 15s, 30s, and 60s sprint categories.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab("leaderboard");
              soundEngine.playKeyPress();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>View Full Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-2.5 px-4">Rank</th>
                <th className="py-2.5 px-4">Typer</th>
                <th className="py-2.5 px-4">Tier Badge</th>
                <th className="py-2.5 px-4 text-right">Speed</th>
                <th className="py-2.5 px-4 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-4 font-bold text-amber-400">🥇 #1</td>
                <td className="py-2.5 px-4 font-bold text-slate-200">⚡ ApexTyper_99</td>
                <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">Master</span></td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-cyan-400">142 WPM</td>
                <td className="py-2.5 px-4 text-right font-mono text-emerald-400">99.4%</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-4 font-bold text-slate-300">🥈 #2</td>
                <td className="py-2.5 px-4 font-bold text-slate-200">🚀 QuantumSwift</td>
                <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">Master</span></td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-cyan-400">138 WPM</td>
                <td className="py-2.5 px-4 text-right font-mono text-emerald-400">98.9%</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-4 font-bold text-amber-600">🥉 #3</td>
                <td className="py-2.5 px-4 font-bold text-slate-200">💎 CyberKeys_X</td>
                <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">Diamond</span></td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-cyan-400">129 WPM</td>
                <td className="py-2.5 px-4 text-right font-mono text-emerald-400">97.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* HOMEPAGE SECTION 6: WHY TYPEBLAST */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Advantages</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Why Choose TypeBlast?</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Designed for programmers, students, administrative professionals, and typing enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Lag WPM Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant sub-millisecond keystroke detection with real-time accuracy and CPM speed metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Gemini AI Typing Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Server-side AI analyzing keystroke errors to generate tailored speed improvement exercises.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Synthesized Audio Feedback</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real mechanical keyboard sound profiles (Cherry MX Blue, Soft Tactile, Retro Typewriter).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Printable PDF Certificates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official verified speed certification diplomas with verification codes and social sharing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Teacher Classroom Portal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Roster management, student WPM tracking, lesson completion stats, and gradebook CSV exports.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">No Ads or Paywalls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean, distraction-free typing environment focused purely on speed, accuracy, and user growth.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Duration Modal */}
      {customDurationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Set Custom Test Duration</span>
            </h3>
            <p className="text-xs text-slate-400">Enter custom test duration in seconds (10 to 600s):</p>
            <input
              type="number"
              min={10}
              max={600}
              value={customDurationInput}
              onChange={(e) => setCustomDurationInput(e.target.value)}
              placeholder="e.g. 45 or 120"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm font-mono focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCustomDurationModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const num = parseInt(customDurationInput, 10);
                  if (num && num >= 10 && num <= 600) {
                    setDuration(num);
                    setCustomDurationModalOpen(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
              >
                Apply Duration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Text Modal */}
      {customTextModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-cyan-400" />
              <span>Custom Typing Passage</span>
            </h3>
            <textarea
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="Paste your custom text or code snippet here..."
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
                Apply Passage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
