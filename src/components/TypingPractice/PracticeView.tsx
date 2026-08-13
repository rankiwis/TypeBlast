import React, { useState, useEffect } from "react";
import { BookOpen, Hand, RotateCcw, Check, Zap } from "lucide-react";
import { soundEngine } from "../../utils/sound";

interface KeyLayout {
  key: string;
  finger: string;
  fingerColor: string;
  wide?: string;
}

const KEYBOARD_ROWS: KeyLayout[][] = [
  // Row 1: Numbers
  [
    { key: "`", finger: "left-pinky", fingerColor: "bg-rose-500/20 text-rose-300" },
    { key: "1", finger: "left-pinky", fingerColor: "bg-rose-500/20 text-rose-300" },
    { key: "2", finger: "left-ring", fingerColor: "bg-amber-500/20 text-amber-300" },
    { key: "3", finger: "left-middle", fingerColor: "bg-yellow-500/20 text-yellow-300" },
    { key: "4", finger: "left-index", fingerColor: "bg-emerald-500/20 text-emerald-300" },
    { key: "5", finger: "left-index", fingerColor: "bg-emerald-500/20 text-emerald-300" },
    { key: "6", finger: "right-index", fingerColor: "bg-cyan-500/20 text-cyan-300" },
    { key: "7", finger: "right-index", fingerColor: "bg-cyan-500/20 text-cyan-300" },
    { key: "8", finger: "right-middle", fingerColor: "bg-blue-500/20 text-blue-300" },
    { key: "9", finger: "right-ring", fingerColor: "bg-indigo-500/20 text-indigo-300" },
    { key: "0", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300" },
    { key: "-", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300" },
    { key: "=", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300" },
    { key: "backspace", finger: "right-pinky", fingerColor: "bg-slate-800 text-slate-400", wide: "w-16" },
  ],
  // Row 2: Top Row
  [
    { key: "tab", finger: "left-pinky", fingerColor: "bg-slate-800 text-slate-400", wide: "w-12" },
    { key: "q", finger: "left-pinky", fingerColor: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
    { key: "w", finger: "left-ring", fingerColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    { key: "e", finger: "left-middle", fingerColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
    { key: "r", finger: "left-index", fingerColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { key: "t", finger: "left-index", fingerColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { key: "y", finger: "right-index", fingerColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
    { key: "u", finger: "right-index", fingerColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
    { key: "i", finger: "right-middle", fingerColor: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { key: "o", finger: "right-ring", fingerColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
    { key: "p", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { key: "[", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { key: "]", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  ],
  // Row 3: Home Row
  [
    { key: "caps", finger: "left-pinky", fingerColor: "bg-slate-800 text-slate-400", wide: "w-14" },
    { key: "a", finger: "left-pinky", fingerColor: "bg-rose-500/30 text-rose-200 border-rose-400 font-bold" },
    { key: "s", finger: "left-ring", fingerColor: "bg-amber-500/30 text-amber-200 border-amber-400 font-bold" },
    { key: "d", finger: "left-middle", fingerColor: "bg-yellow-500/30 text-yellow-200 border-yellow-400 font-bold" },
    { key: "f", finger: "left-index", fingerColor: "bg-emerald-500/30 text-emerald-200 border-emerald-400 font-bold" },
    { key: "g", finger: "left-index", fingerColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    { key: "h", finger: "right-index", fingerColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
    { key: "j", finger: "right-index", fingerColor: "bg-cyan-500/30 text-cyan-200 border-cyan-400 font-bold" },
    { key: "k", finger: "right-middle", fingerColor: "bg-blue-500/30 text-blue-200 border-blue-400 font-bold" },
    { key: "l", finger: "right-ring", fingerColor: "bg-indigo-500/30 text-indigo-200 border-indigo-400 font-bold" },
    { key: ";", finger: "right-pinky", fingerColor: "bg-purple-500/30 text-purple-200 border-purple-400 font-bold" },
    { key: "'", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { key: "enter", finger: "right-pinky", fingerColor: "bg-slate-800 text-slate-400", wide: "w-16" },
  ],
  // Row 4: Bottom Row
  [
    { key: "shift", finger: "left-pinky", fingerColor: "bg-slate-800 text-slate-400", wide: "w-16" },
    { key: "z", finger: "left-pinky", fingerColor: "bg-rose-500/20 text-rose-300" },
    { key: "x", finger: "left-ring", fingerColor: "bg-amber-500/20 text-amber-300" },
    { key: "c", finger: "left-middle", fingerColor: "bg-yellow-500/20 text-yellow-300" },
    { key: "v", finger: "left-index", fingerColor: "bg-emerald-500/20 text-emerald-300" },
    { key: "b", finger: "left-index", fingerColor: "bg-emerald-500/20 text-emerald-300" },
    { key: "n", finger: "right-index", fingerColor: "bg-cyan-500/20 text-cyan-300" },
    { key: "m", finger: "right-index", fingerColor: "bg-cyan-500/20 text-cyan-300" },
    { key: ",", finger: "right-middle", fingerColor: "bg-blue-500/20 text-blue-300" },
    { key: ".", finger: "right-ring", fingerColor: "bg-indigo-500/20 text-indigo-300" },
    { key: "/", finger: "right-pinky", fingerColor: "bg-purple-500/20 text-purple-300" },
  ],
  // Row 5: Spacebar
  [
    { key: "space", finger: "thumb", fingerColor: "bg-slate-800 text-slate-300", wide: "w-64" },
  ],
];

export const PracticeView: React.FC = () => {
  const [drillMode, setDrillMode] = useState<"homerow" | "toprow" | "bottomrow" | "pinky" | "numbers">("homerow");
  const [drillText, setDrillText] = useState("asdf jkl; asdf jkl; ffdj jjkk aass ddl;");
  const [inputVal, setInputVal] = useState("");
  const [activeKey, setActiveKey] = useState("a");

  useEffect(() => {
    switch (drillMode) {
      case "homerow":
        setDrillText("asdf jkl; asdf jkl; ffdj jjkk aass ddl; asdf jkl;");
        break;
      case "toprow":
        setDrillText("qwer poiuy qwer poiuy qwer poiuy rewq yuiop");
        break;
      case "bottomrow":
        setDrillText("zxcv bnm, zxcv bnm, vcxz ,mnb zxcv bnm,");
        break;
      case "pinky":
        setDrillText("a; qp z/ a; qp z/ 10 -= a; qp z/");
        break;
      case "numbers":
        setDrillText("1234 5678 9012 3456 7890 12345 67890");
        break;
    }
    setInputVal("");
  }, [drillMode]);

  const currentTargetChar = drillText[inputVal.length] || "a";

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    soundEngine.playKeyPress(val[val.length - 1] === " ");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Touch Typing Practice Studio</span>
          </h3>
          <p className="text-xs text-slate-400">Master correct finger placement with real-time visual feedback</p>
        </div>

        {/* Drill Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "homerow", label: "Home Row" },
            { id: "toprow", label: "Top Row" },
            { id: "bottomrow", label: "Bottom Row" },
            { id: "pinky", label: "Pinky Reaches" },
            { id: "numbers", label: "Numbers" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDrillMode(d.id as any);
                soundEngine.playKeyPress();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                drillMode === d.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Practice Text Input Box */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="text-xl font-mono p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 tracking-wider">
          {drillText.split("").map((char, idx) => {
            let cls = "text-slate-600";
            if (idx < inputVal.length) {
              cls = inputVal[idx] === char ? "text-emerald-400 font-bold" : "text-rose-400 bg-rose-500/20";
            } else if (idx === inputVal.length) {
              cls = "text-cyan-300 bg-cyan-500/20 border-b-2 border-cyan-400 animate-pulse font-bold";
            }
            return (
              <span key={idx} className={cls}>
                {char}
              </span>
            );
          })}
        </div>

        <input
          type="text"
          value={inputVal}
          onChange={handleInput}
          placeholder="Type drill text above to practice finger positioning..."
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
          autoFocus
        />
      </div>

      {/* Interactive Visual Keyboard */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <Hand className="w-4 h-4 text-cyan-400" />
            <span>Interactive Finger Map Guide</span>
          </span>
          <span>Target Key: <strong className="text-cyan-400 uppercase font-mono text-sm">{currentTargetChar === " " ? "SPACE" : currentTargetChar}</strong></span>
        </div>

        {/* Keyboard Layout Rows */}
        <div className="space-y-2 flex flex-col items-center">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5">
              {row.map((k, kIdx) => {
                const isTarget = currentTargetChar.toLowerCase() === k.key;
                return (
                  <div
                    key={kIdx}
                    className={`h-11 ${k.wide || "w-10"} rounded-lg border flex flex-col items-center justify-center text-xs font-mono font-medium transition-all ${
                      isTarget
                        ? "bg-cyan-400 text-slate-950 font-black border-cyan-300 scale-110 shadow-lg shadow-cyan-500/30 z-10"
                        : `${k.fingerColor} border-slate-800/80`
                    }`}
                  >
                    <span className="uppercase">{k.key}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Color-Coded Finger Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500" /> L Pinky</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" /> L Ring</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500/40 border border-yellow-500" /> L Middle</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" /> L Index</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-500" /> R Index</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500" /> R Middle</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500/40 border border-indigo-500" /> R Ring</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500/40 border border-purple-500" /> R Pinky</div>
        </div>
      </div>
    </div>
  );
};
