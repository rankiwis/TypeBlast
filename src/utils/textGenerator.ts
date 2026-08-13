import { TestCategory } from "../types";

export const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
  "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just",
  "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see",
  "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "world", "system", "program", "code", "speed", "focus",
  "blast", "keyboard", "finger", "accuracy", "practice", "master", "challenge", "lesson", "rhythm",
  "flow", "brain", "light", "screen", "power", "future", "rapid", "smooth", "perfect", "boost", "victory"
];

export const FAMOUS_QUOTES = [
  "The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle.",
  "Simplicity is prerequisite for reliability. Software engineering is the art of crafting clarity out of chaos.",
  "Life is what happens when you are busy making other plans. Turn your face toward the sun and the shadows fall behind you.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts in the grand tapestry of achievement.",
  "In three words I can sum up everything I have learned about life: it goes on. Embrace every swift keystroke.",
  "Your time is limited, so do not waste it living someone else's life. Trust the process and cultivate your mastery every day.",
  "Code is like humor. When you have to explain it, it is bad. Focus on clean logic and elegant execution."
];

export const CODE_SNIPPETS = [
  "const calculateWpm = (chars: number, seconds: number) => Math.round((chars / 5) / (seconds / 60));",
  "function binarySearch(arr: number[], target: number): number { let low = 0, high = arr.length - 1; return target; }",
  "const [state, setState] = useState<{ activeKey: string; score: number }>({ activeKey: 'A', score: 100 });",
  "export async function fetchAiCoach(stats: TypingStats) { return await fetch('/api/ai-coach', { method: 'POST' }); }",
  "Array.from({ length: 10 }, (_, i) => i * 2).filter(val => val % 4 === 0).map(x => x.toString());"
];

export const NUMBERS_AND_PUNCTUATION = [
  "Order #8492 placed on 10/24/2026 for $1,299.99 with 15% discount code 'TYPE2026'!",
  "In 2025, over 85.4% of developers reported typing above 72 WPM with 97.8% accuracy.",
  "Phone: +1 (800) 555-0199 | Fax: 408-555-0123 | Zip: 94103-4821 | ID: #90210-X!",
  "Math equations: 2^10 = 1024, 3.14159 * r^2, 100 / 4 = 25, (a + b) * (a - b) = a^2 - b^2."
];

export const KIDS_WORDS = [
  "cat", "dog", "sun", "star", "jump", "play", "frog", "duck", "blue", "pink", "gold",
  "happy", "smile", "dance", "magic", "rocket", "planet", "super", "hero", "blast",
  "candy", "cookie", "apple", "banana", "puppy", "kitten", "ocean", "rainbow", "shine"
];

export function generateTestText(category: TestCategory, count: number = 50, isKids: boolean = false): string {
  if (isKids) {
    const words: string[] = [];
    const targetCount = Math.max(30, count);
    for (let i = 0; i < targetCount; i++) {
      const randomWord = KIDS_WORDS[Math.floor(Math.random() * KIDS_WORDS.length)];
      words.push(randomWord);
    }
    return words.join(" ");
  }

  switch (category) {
    case "quotes": {
      const quotes: string[] = [];
      const numQuotesNeeded = Math.max(1, Math.ceil(count / 25));
      for (let i = 0; i < numQuotesNeeded; i++) {
        const quote = FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
        quotes.push(quote);
      }
      return quotes.join(" ");
    }
    case "code": {
      const snippets: string[] = [];
      const numNeeded = Math.max(1, Math.ceil(count / 15));
      for (let i = 0; i < numNeeded; i++) {
        const code = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        snippets.push(code);
      }
      return snippets.join(" ");
    }
    case "numbers": {
      const nums: string[] = [];
      const numNeeded = Math.max(1, Math.ceil(count / 15));
      for (let i = 0; i < numNeeded; i++) {
        const numText = NUMBERS_AND_PUNCTUATION[Math.floor(Math.random() * NUMBERS_AND_PUNCTUATION.length)];
        nums.push(numText);
      }
      return nums.join(" ");
    }
    case "words":
    default: {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        const randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        words.push(randomWord);
      }
      return words.join(" ");
    }
  }
}

export const DAILY_CHALLENGES = [
  {
    date: "Today",
    title: "Quantum Speed Sprint",
    prompt: "The swift momentum of technological evolution demands unwavering precision, relentless focus, and flawless finger dexterity across all row transitions.",
    targetWpm: 75,
    rewardXp: 500,
    badge: "Quantum Striker 🔥"
  },
  {
    date: "Tomorrow",
    title: "Punctuation Perfection",
    prompt: "Is code clarity paramount? Absolutely! (If x >= 100 && y <= 50) { return true; } else { console.log('Keep grinding!'); }",
    targetWpm: 65,
    rewardXp: 450,
    badge: "Syntax Samurai ⚔️"
  }
];
