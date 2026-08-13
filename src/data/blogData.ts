export type BlogCategory =
  | "Typing Speed"
  | "Typing Practice"
  | "Touch Typing"
  | "Keyboard Skills"
  | "Typing Games"
  | "Career & Jobs"
  | "Kids & Education";

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  category: BlogCategory;
  author: Author;
  publishedDate: string; // ISO format e.g. "2026-02-10"
  updatedDate: string;   // ISO format e.g. "2026-08-05"
  featuredImage: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  content: string; // Structured HTML or rich text content
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Typing Speed",
  "Typing Practice",
  "Touch Typing",
  "Keyboard Skills",
  "Typing Games",
  "Career & Jobs",
  "Kids & Education",
];

export const AUTHORS: Record<string, Author> = {
  research: {
    name: "TypeBlast Research Team",
    role: "Speed Analytics & Ergonomics Lab",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Our team of typing speed coaches, ergonomic researchers, and software engineers dedicated to high-precision keyboard telemetry and muscle-memory training.",
  },
  elena: {
    name: "Elena Rostova",
    role: "Senior Speed Coach & Ergonomics Specialist",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Competitive typist averaging 140+ WPM. Elena designs finger-placement drills and posture protocols for tech professionals and transcriptionists.",
  },
  marcus: {
    name: "Marcus Vance",
    role: "Hardware & Keyboard Architecture Lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Mechanical keyboard designer and software developer focused on keystroke latency reduction, switch actuation dynamics, and muscle-memory feedback loops.",
  },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "how-to-type-100-wpm-touch-typing-guide",
    title: "The Ultimate Guide to Reaching 100+ WPM with Touch Typing",
    metaDescription: "Master touch typing techniques to hit 100+ WPM. Learn proper finger placement, muscle memory training, and speed drills for maximum efficiency.",
    excerpt: "Breaking the 100 WPM milestone requires more than raw finger speed—it demands pure muscle memory, zero sight-checking, and optimal rhythm. Here is the step-by-step blueprint.",
    category: "Touch Typing",
    author: AUTHORS.elena,
    publishedDate: "2026-02-15",
    updatedDate: "2026-08-01",
    featuredImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80",
    readingTime: "6 min read",
    tags: ["Touch Typing", "100 WPM", "Muscle Memory", "Speed Drills"],
    featured: true,
    content: `
      <h2>Why 100 WPM Is the Gold Standard for Knowledge Workers</h2>
      <p>The average computer user types between 38 and 42 words per minute (WPM) with roughly 92% accuracy. Crossing the <strong>100 WPM threshold</strong> puts you in the top 1% of keyboard users worldwide. At 100 WPM, the keyboard stops being a physical barrier and becomes a direct line from your thoughts to the screen.</p>
      
      <div class="my-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-cyan-200 text-sm">
        <strong class="text-cyan-400 block mb-1">💡 Key Insight:</strong>
        Typing at 100 WPM instead of 40 WPM saves approximately 21 minutes per day of pure typing time—equivalent to over 120 hours saved every year.
      </div>

      <h2>1. The Non-Negotiable Rule: Never Look at Your Fingers</h2>
      <p>The single biggest bottleneck to typing speed is visual feedback loop delay. When you look down at the keyboard, your brain performs three sequential steps:</p>
      <ul>
        <li>Locating the targeted physical key visually</li>
        <li>Positioning your finger above the key</li>
        <li>Verifying the output on the display screen</li>
      </ul>
      <p>True touch typing relies strictly on <em>proprioception</em>—your brain's sense of finger positioning relative to the home row bumps on <strong>F</strong> and <strong>J</strong>.</p>

      <h2>2. Master the Home Row Anchor System</h2>
      <p>Your hands must always rest lightly on the home row keys:</p>
      <ul>
        <li><strong>Left Hand:</strong> A (pinky), S (ring), D (middle), F (index with tactile homing bump)</li>
        <li><strong>Right Hand:</strong> J (index with tactile homing bump), K (middle), L (ring), ; (pinky)</li>
        <li><strong>Thumbs:</strong> Hovering gently over the Spacebar</li>
      </ul>

      <h2>3. Prioritize 98%+ Accuracy Over Raw Speed</h2>
      <p>Counterintuitively, trying to type faster often makes you slower. Every backspace penalty forces you to press Backspace, re-orient your finger, re-type the missed character, and continue. A single typo can reduce your net WPM for a 15-second test by up to 15 WPM.</p>

      <div class="my-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <h3 class="text-white font-bold text-base mb-2">3-Step Practice Drill Schedule:</h3>
        <ol class="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li><strong>10 Minutes Daily:</strong> Focus exclusively on weak key combinations using TypeBlast Targeted Drills.</li>
          <li><strong>5 Minutes Daily:</strong> Run 60-second timed benchmark tests to track WPM consistency.</li>
          <li><strong>Weekly Audit:</strong> Review your TypeBlast Error Heatmap to identify recurring finger combination slip-ups.</li>
        </ol>
      </div>

      <h2>4. Develop Micro-Rhythm Pacing</h2>
      <p>Top speed typists don't burst frantically; they maintain a steady, metronome-like keystroke rhythm. Rather than accelerating on easy words like <em>"the"</em> and stumbling on complex words like <em>"rhythm"</em>, strive for uniform key press intervals.</p>
    `,
  },
  {
    id: "post-2",
    slug: "home-row-finger-placement-mastery",
    title: "Home Row Mastery: Essential Finger Placement & Muscle Memory Drills",
    metaDescription: "Master home row finger placement for flawless touch typing. Step-by-step guide with placement diagrams and targeted muscle memory exercises.",
    excerpt: "The home row is the launchpad for every keystroke. Learn the exact finger movement zones, home row anchors, and drills to eliminate hunting and pecking forever.",
    category: "Typing Practice",
    author: AUTHORS.elena,
    publishedDate: "2026-03-01",
    updatedDate: "2026-08-03",
    featuredImage: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1200&auto=format&fit=crop&q=80",
    readingTime: "5 min read",
    tags: ["Home Row", "Finger Placement", "Practice Drills", "Beginner Guide"],
    featured: false,
    content: `
      <h2>The Foundation of Touch Typing: Home Row Mechanics</h2>
      <p>Whether you're aimlessly tapping with two index fingers or trying to break out of a 50 WPM plateau, mastering proper finger assignments is essential. Every key on a standard QWERTY keyboard is assigned to one specific finger.</p>

      <h2>Key-to-Finger Assignment Matrix</h2>
      <p>Here is the official finger assignment protocol used in professional touch typing instruction:</p>

      <div class="overflow-x-auto my-6">
        <table class="w-full text-left text-sm border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-cyan-400">
              <th class="p-3 border border-slate-800">Finger</th>
              <th class="p-3 border border-slate-800">Home Key</th>
              <th class="p-3 border border-slate-800">Assigned Keys</th>
            </tr>
          </thead>
          <tbody class="text-slate-300">
            <tr class="border border-slate-800 bg-slate-950">
              <td class="p-3 border border-slate-800 font-semibold">Left Pinky</td>
              <td class="p-3 border border-slate-800">A</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">Q, A, Z, 1, Shift, Caps Lock</td>
            </tr>
            <tr class="border border-slate-800 bg-slate-900/50">
              <td class="p-3 border border-slate-800 font-semibold">Left Ring</td>
              <td class="p-3 border border-slate-800">S</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">W, S, X, 2</td>
            </tr>
            <tr class="border border-slate-800 bg-slate-950">
              <td class="p-3 border border-slate-800 font-semibold">Left Middle</td>
              <td class="p-3 border border-slate-800">D</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">E, D, C, 3</td>
            </tr>
            <tr class="border border-slate-800 bg-slate-900/50">
              <td class="p-3 border border-slate-800 font-semibold">Left Index</td>
              <td class="p-3 border border-slate-800">F (Bump)</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">R, T, F, G, V, B, 4, 5</td>
            </tr>
            <tr class="border border-slate-800 bg-slate-950">
              <td class="p-3 border border-slate-800 font-semibold">Right Index</td>
              <td class="p-3 border border-slate-800">J (Bump)</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">Y, U, H, J, N, M, 6, 7</td>
            </tr>
            <tr class="border border-slate-800 bg-slate-900/50">
              <td class="p-3 border border-slate-800 font-semibold">Right Middle</td>
              <td class="p-3 border border-slate-800">K</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">I, K, , (comma), 8</td>
            </tr>
            <tr class="border border-slate-800 bg-slate-950">
              <td class="p-3 border border-slate-800 font-semibold">Right Ring</td>
              <td class="p-3 border border-slate-800">L</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">O, L, . (period), 9</td>
            </tr>
            <tr class="border border-slate-800 bg-slate-900/50">
              <td class="p-3 border border-slate-800 font-semibold">Right Pinky</td>
              <td class="p-3 border border-slate-800">;</td>
              <td class="p-3 border border-slate-800 font-mono text-cyan-300">P, ;, /, 0, Enter, Shift</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3 Daily Drills for Rock-Solid Muscle Memory</h2>
      <p>Execute these 3 drills on TypeBlast Practice Mode for 5 minutes each session:</p>
      <ul>
        <li><strong>Drill 1 (Home Row Isolation):</strong> Type <code>asdf jkl; asdf jkl;</code> until you reach 100% accuracy without glancing down.</li>
        <li><strong>Drill 2 (Vertical Finger Reaches):</strong> Practice reaching up to <code>qwer poiuy</code> and returning instantly to home row position.</li>
        <li><strong>Drill 3 (Pinky Shift Practice):</strong> Practice capitalized word triggers using opposite-hand Shift key presses.</li>
      </ul>
    `,
  },
  {
    id: "post-3",
    slug: "ergonomics-and-wrist-health-for-typists",
    title: "Typing Ergonomics: How to Avoid Wrist Strain & Carpal Tunnel Syndrome",
    metaDescription: "Prevent wrist pain and carpal tunnel syndrome while typing. Ergonomic desk setup, wrist rest advice, and floating posture techniques for high WPM.",
    excerpt: "Speed without ergonomics leads to strain, fatigue, and repetitive stress injuries. Learn optimal wrist angles, neutral floating posture, and desk ergonomics.",
    category: "Keyboard Skills",
    author: AUTHORS.research,
    publishedDate: "2026-03-20",
    updatedDate: "2026-08-02",
    featuredImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200&auto=format&fit=crop&q=80",
    readingTime: "7 min read",
    tags: ["Ergonomics", "Wrist Health", "Posture", "Carpal Tunnel"],
    featured: false,
    content: `
      <h2>The Hidden Cost of Poor Typing Posture</h2>
      <p>Typing thousands of words daily puts intense micro-stress on your wrist tendons, median nerve, and forearms. Extended sessions with bent wrists or harsh desk edges often lead to <strong>Repetitive Strain Injury (RSI)</strong> or <strong>Carpal Tunnel Syndrome</strong>.</p>

      <h2>1. The Neutral Floating Wrist Technique</h2>
      <p>The most common mistake typists make is resting their wrist heels heavily on the desk or a soft pad while actively typing. This creates vertical wrist flexion, pinching the median nerve inside the carpal tunnel.</p>
      
      <div class="my-6 p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-200 text-sm">
        <strong class="text-purple-300 block mb-1">🧘 Golden Rule of Ergonomics:</strong>
        Float your wrists slightly elevated above the desk surface while typing. Use wrist rests only during rest pauses—never as a pivot point while active.
      </div>

      <h2>2. Desk Height & Elbow Angle Checklist</h2>
      <ul>
        <li><strong>Elbow Angle:</strong> Position your chair and desk so your arms form a 90 to 100-degree angle at the elbow joint.</li>
        <li><strong>Shoulders:</strong> Keep shoulders relaxed and dropped—never hunched up toward your ears.</li>
        <li><strong>Display Height:</strong> Top third of your monitor should align with eye level to keep your neck straight.</li>
      </ul>

      <h2>3. 20-20-20 Micro-Breaks for Peak Endurance</h2>
      <p>Every 20 minutes of intense typing, pause for 20 seconds and gently stretch your forearm flexors and wrists. TypeBlast includes automatic posture pause reminders in long 5-minute typing tests.</p>
    `,
  },
  {
    id: "post-4",
    slug: "how-typing-speed-impacts-tech-careers",
    title: "Why Typing Speed Is a Game-Changer in Tech, Law, and Remote Careers",
    metaDescription: "Discover how typing WPM directly impacts salary potential, job performance, and cognitive workflow in software engineering, legal, and remote roles.",
    excerpt: "Is fast typing still relevant in an era of AI assistants? Discover how 80+ WPM typing directly unlocks flow state, developer velocity, and administrative efficiency.",
    category: "Career & Jobs",
    author: AUTHORS.marcus,
    publishedDate: "2026-04-10",
    updatedDate: "2026-08-04",
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    readingTime: "6 min read",
    tags: ["Career Growth", "Developer Velocity", "WPM Benchmarks", "Productivity"],
    featured: false,
    content: `
      <h2>The Cognitive Burden of Slow Typing</h2>
      <p>When you type at 35 WPM, your brain spends continuous cognitive bandwidth locating keys, fixing typos, and managing backspaces. This constant friction disrupts your <strong>Flow State</strong>—the deep, uninterrupted focus needed for writing complex code, drafting legal briefs, or managing live client communications.</p>

      <h2>Average WPM Standards by Career Domain</h2>
      <div class="my-6 space-y-3">
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
          <span class="text-white font-semibold">General Office Worker</span>
          <span class="font-mono text-cyan-400 font-bold">40 – 50 WPM</span>
        </div>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
          <span class="text-white font-semibold">Software Developer / Engineer</span>
          <span class="font-mono text-cyan-400 font-bold">65 – 80 WPM</span>
        </div>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
          <span class="text-white font-semibold">Executive Assistant / Legal Secretary</span>
          <span class="font-mono text-cyan-400 font-bold">75 – 90 WPM</span>
        </div>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
          <span class="text-white font-semibold">Court Reporter / Stenographer</span>
          <span class="font-mono text-cyan-400 font-bold">180 – 225 WPM</span>
        </div>
      </div>

      <h2>How Fast Typing Supercharges Developer Velocity</h2>
      <p>Software development is not just about writing syntax—it involves rapid navigation between terminal tabs, IDE hotkeys, git commands, and code documentation. Engineers with 80+ WPM and strong command-line muscle memory spend less time fighting tools and more time solving architectural problems.</p>
    `,
  },
  {
    id: "post-5",
    slug: "gamified-typing-for-kids-and-students",
    title: "Gamified Typing for Kids & Students: How Play Builds Lifelong Speed",
    metaDescription: "Learn how interactive typing games help kids and students develop touch typing muscle memory, accuracy, and confidence early in life.",
    excerpt: "Turn boring keyboard practice into high-octane arcade fun. Discover how games like Word Blast and Speed Defense make finger placement second nature for young learners.",
    category: "Kids & Education",
    author: AUTHORS.elena,
    publishedDate: "2026-05-02",
    updatedDate: "2026-08-01",
    featuredImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
    readingTime: "5 min read",
    tags: ["Kids Education", "Typing Games", "Gamified Learning", "Student Speed"],
    featured: false,
    content: `
      <h2>Why Traditional Drill Books Fail Young Learners</h2>
      <p>For children and young students, repeating monotonous rows of characters without immediate visual feedback leads to boredom and hunting-and-pecking habits. Gamified learning replaces boring repetition with immediate visual rewards, streak counters, and arcade challenges.</p>

      <h2>The Science of Micro-Feedback Loops in Typing Games</h2>
      <p>Arcade typing games leverage <em>dopamine-driven feedback loops</em>. When a child types a word to destroy an incoming meteor in TypeBlast <strong>Word Defense Arena</strong>, they receive:</p>
      <ul>
        <li><strong>Instant Audio Haptics:</strong> Satisfying click sounds on valid keystrokes.</li>
        <li><strong>Visual Score Accelerators:</strong> Multipliers for high accuracy streaks.</li>
        <li><strong>Level Progressions:</strong> Unlocking new avatars and speed badges.</li>
      </ul>

      <h2>Recommended Age Progression Guide</h2>
      <p>Start children with basic home row letter recognition at age 7–8, transition to full touch typing by age 10, and introduce code snippets or timed tests during middle school.</p>
    `,
  },
  {
    id: "post-6",
    slug: "mechanical-keyboard-switches-wpm-guide",
    title: "Mechanical Keyboard Switch Guide: Linear vs Tactile vs Clicky for Max WPM",
    metaDescription: "Does your keyboard switch choice affect typing speed? In-depth breakdown of Linear, Tactile, and Clicky mechanical switches for competitive typists.",
    excerpt: "Does switch actuation force, tactile feedback, or key travel distance really impact your WPM score? We analyze Cherry MX, Gateron, and custom switches.",
    category: "Keyboard Skills",
    author: AUTHORS.marcus,
    publishedDate: "2026-05-18",
    updatedDate: "2026-08-05",
    featuredImage: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200&auto=format&fit=crop&q=80",
    readingTime: "6 min read",
    tags: ["Mechanical Keyboards", "Switches", "Hardware", "Linear vs Tactile"],
    featured: false,
    content: `
      <h2>Does Hardware Really Change Your WPM?</h2>
      <p>While muscle memory and accuracy account for 90% of typing performance, the hardware under your fingertips plays a key role in reducing finger fatigue during long sessions. Mechanical switches offer key advantages over cheap membrane keyboards: consistent actuation points, faster reset travel, and zero key ghosting.</p>

      <h2>The 3 Main Switch Types Breakdown</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-xs uppercase font-bold text-red-400">Linear (e.g. Red / Speed Silver)</span>
          <p class="text-xs text-slate-300">Smooth, continuous keystroke with no bump. Fastest actuation for high-frequency burst typists, but requires finger control to avoid accidental mispresses.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-xs uppercase font-bold text-amber-400">Tactile (e.g. Brown / Holy Panda)</span>
          <p class="text-xs text-slate-300">Gentle tactile bump right at the actuation point. Ideal for maximum typing accuracy, giving tactile feedback without excessive noise.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-xs uppercase font-bold text-cyan-400">Clicky (e.g. Blue / Jade)</span>
          <p class="text-xs text-slate-300">Audible click sound paired with a tactile bump. Fun and acoustic, but can cause acoustic fatigue during intense multi-hour typing sessions.</p>
        </div>
      </div>

      <h2>Actuation Force & Key Travel Distance</h2>
      <p>For speed typists, light actuation forces (between 35g and 45g) reduce finger muscle strain. Short travel switches (like Speed Silvers with 1.2mm actuation) allow faster key resets, perfect for breaking speed records on TypeBlast.</p>
    `,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const normalizedSlug = slug.replace(/^\/|\/$/g, "");
  return BLOG_POSTS.find((p) => p.slug === normalizedSlug);
}

export function getRelatedBlogPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (p) => p.id !== currentPost.id && (p.category === currentPost.category || p.tags.some((t) => currentPost.tags.includes(t)))
  ).slice(0, limit);
}
