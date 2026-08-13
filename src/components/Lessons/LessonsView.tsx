import React, { useState } from "react";
import { GraduationCap, Star, CheckCircle2, Lock, ArrowRight, RotateCcw } from "lucide-react";
import { soundEngine } from "../../utils/sound";

interface LessonItem {
  id: string;
  unit: string;
  title: string;
  description: string;
  targetKeys: string[];
  content: string;
  minAccuracy: number;
  completed: boolean;
  stars: number;
}

const LESSON_UNITS: LessonItem[] = [
  {
    id: "l1",
    unit: "Unit 1: Home Row",
    title: "Lesson 1: Left Hand Home Row (ASDF)",
    description: "Anchor your left hand fingers on A, S, D, and F keys.",
    targetKeys: ["a", "s", "d", "f"],
    content: "a s d f asdf aass ddfa fdas",
    minAccuracy: 95,
    completed: true,
    stars: 3,
  },
  {
    id: "l2",
    unit: "Unit 1: Home Row",
    title: "Lesson 2: Right Hand Home Row (JKL;)",
    description: "Anchor your right hand fingers on J, K, L, and semicolon ;.",
    targetKeys: ["j", "k", "l", ";"],
    content: "j k l ; jkl; jjkk ll;; ;lkj",
    minAccuracy: 95,
    completed: true,
    stars: 3,
  },
  {
    id: "l3",
    unit: "Unit 1: Home Row",
    title: "Lesson 3: Both Hands Combined (ASDF JKL;)",
    description: "Combine left and right hands seamlessly across the home row.",
    targetKeys: ["a", "s", "d", "f", "j", "k", "l", ";"],
    content: "asdf jkl; aass jjkk ffdj kkl; asdf jkl;",
    minAccuracy: 95,
    completed: false,
    stars: 0,
  },
  {
    id: "l4",
    unit: "Unit 2: Top Row",
    title: "Lesson 4: Top Row Reaches (QWERTY)",
    description: "Learn index and middle finger reaches to top row keys.",
    targetKeys: ["q", "w", "e", "r", "t", "y"],
    content: "qwer tyui opqw erty uiop",
    minAccuracy: 90,
    completed: false,
    stars: 0,
  },
  {
    id: "l5",
    unit: "Unit 3: Numbers & Symbols",
    title: "Lesson 5: Top Row Numbers (12345)",
    description: "Develop touch confidence reaching for top row numbers.",
    targetKeys: ["1", "2", "3", "4", "5"],
    content: "12345 54321 1122 3344 55123",
    minAccuracy: 90,
    completed: false,
    stars: 0,
  },
];

export const LessonsView: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [lessonInput, setLessonInput] = useState("");
  const [lessonDone, setLessonDone] = useState(false);

  const startLesson = (lesson: LessonItem) => {
    setActiveLesson(lesson);
    setLessonInput("");
    setLessonDone(false);
    soundEngine.playKeyPress();
  };

  const handleLessonInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLessonInput(val);
    soundEngine.playKeyPress();

    if (activeLesson && val.length >= activeLesson.content.length) {
      setLessonDone(true);
      soundEngine.playFinishChime();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>Interactive Typing Curriculum</span>
          </h3>
          <p className="text-xs text-slate-400">Step-by-step touch typing lessons from home row to advanced coding symbols</p>
        </div>
      </div>

      {/* Lesson List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LESSON_UNITS.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => startLesson(lesson)}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-cyan-400 font-semibold">{lesson.unit}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= lesson.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {lesson.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1">{lesson.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                {lesson.targetKeys.map((k) => (
                  <span
                    key={k}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs uppercase"
                  >
                    {k}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Lesson Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-cyan-400 font-semibold uppercase">{activeLesson.unit}</span>
                <h3 className="text-lg font-bold text-white">{activeLesson.title}</h3>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xl text-slate-400 tracking-wider">
              {activeLesson.content.split("").map((c, idx) => {
                let cls = "text-slate-600";
                if (idx < lessonInput.length) {
                  cls = lessonInput[idx] === c ? "text-emerald-400 font-bold" : "text-rose-400 bg-rose-500/20";
                } else if (idx === lessonInput.length) {
                  cls = "text-cyan-300 bg-cyan-500/20 border-b-2 border-cyan-400 animate-pulse font-bold";
                }
                return (
                  <span key={idx} className={cls}>
                    {c}
                  </span>
                );
              })}
            </div>

            <input
              type="text"
              value={lessonInput}
              onChange={handleLessonInput}
              placeholder="Type lesson text here..."
              disabled={lessonDone}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
              autoFocus
            />

            {lessonDone && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Lesson Completed!</h4>
                <p className="text-xs text-slate-300">You achieved 98% accuracy! 3 Stars Earned ⭐⭐⭐</p>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-6 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Continue Curriculum
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
