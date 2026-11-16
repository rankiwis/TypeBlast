import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

/**
 * Small key-value storage layer used by every TypeBlast store.
 *
 * - On Vercel (or anywhere the Upstash env vars are set) data lives in Upstash Redis,
 *   so it survives deploys and is shared across serverless instances.
 * - Locally, with no Upstash credentials, data lives in memory and is mirrored to
 *   data/kv.json so `npm run dev` keeps working without any setup.
 *
 * Values are JSON-serializable objects. Every method is async.
 */
export interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlMs?: number): Promise<void>;
  del(key: string): Promise<void>;
  hget<T>(hash: string, field: string): Promise<T | null>;
  hset(hash: string, field: string, value: unknown): Promise<void>;
  /** Sets a field only if it does not exist yet. Returns true when it was set. */
  hsetnx(hash: string, field: string, value: unknown): Promise<boolean>;
  hdel(hash: string, field: string): Promise<void>;
  hgetall<T>(hash: string): Promise<Record<string, T>>;
  /** Increments a counter and starts its expiry window on first use. Returns the new count. */
  incr(key: string, ttlMs: number): Promise<number>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
}

const PREFIX = "tb:";

// ---------------------------------------------------------------------------
// Upstash Redis backend
// ---------------------------------------------------------------------------
class UpstashKV implements KVStore {
  constructor(private redis: Redis) {}

  async get<T>(key: string) {
    return ((await this.redis.get<T>(PREFIX + key)) ?? null) as T | null;
  }
  async set(key: string, value: unknown, ttlMs?: number) {
    if (ttlMs && ttlMs > 0) {
      await this.redis.set(PREFIX + key, value, { px: Math.ceil(ttlMs) });
    } else {
      await this.redis.set(PREFIX + key, value);
    }
  }
  async del(key: string) {
    await this.redis.del(PREFIX + key);
  }
  async hget<T>(hash: string, field: string) {
    return ((await this.redis.hget<T>(PREFIX + hash, field)) ?? null) as T | null;
  }
  async hset(hash: string, field: string, value: unknown) {
    await this.redis.hset(PREFIX + hash, { [field]: value });
  }
  async hsetnx(hash: string, field: string, value: unknown) {
    return (await this.redis.hsetnx(PREFIX + hash, field, value)) === 1;
  }
  async hdel(hash: string, field: string) {
    await this.redis.hdel(PREFIX + hash, field);
  }
  async hgetall<T>(hash: string) {
    return ((await this.redis.hgetall<Record<string, T>>(PREFIX + hash)) ?? {}) as Record<string, T>;
  }
  async incr(key: string, ttlMs: number) {
    const fullKey = PREFIX + key;
    const count = await this.redis.incr(fullKey);
    if (count === 1) {
      await this.redis.pexpire(fullKey, Math.ceil(ttlMs));
    }
    return count;
  }
  async sadd(key: string, member: string) {
    await this.redis.sadd(PREFIX + key, member);
  }
  async srem(key: string, member: string) {
    await this.redis.srem(PREFIX + key, member);
  }
  async smembers(key: string) {
    return (await this.redis.smembers(PREFIX + key)) ?? [];
  }
}

// ---------------------------------------------------------------------------
// Local file-backed backend (development only)
// ---------------------------------------------------------------------------
interface LocalEntry {
  v: unknown;
  exp?: number; // epoch ms
}

class LocalFileKV implements KVStore {
  private data: Record<string, LocalEntry> = {};
  private saveTimer: NodeJS.Timeout | null = null;

  constructor(private file: string) {
    try {
      if (fs.existsSync(file)) {
        this.data = JSON.parse(fs.readFileSync(file, "utf-8"));
      }
    } catch (e) {
      console.error("Failed to load local KV file, starting empty:", e);
      this.data = {};
    }
  }

  private scheduleSave() {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      try {
        fs.mkdirSync(path.dirname(this.file), { recursive: true });
        fs.writeFileSync(this.file, JSON.stringify(this.data), "utf-8");
      } catch (e) {
        console.error("Failed to save local KV file:", e);
      }
    }, 50);
    this.saveTimer.unref?.();
  }

  private read(key: string): LocalEntry | null {
    const entry = this.data[key];
    if (!entry) return null;
    if (entry.exp && entry.exp < Date.now()) {
      delete this.data[key];
      this.scheduleSave();
      return null;
    }
    return entry;
  }

  private write(key: string, v: unknown, ttlMs?: number) {
    this.data[key] = ttlMs && ttlMs > 0 ? { v, exp: Date.now() + ttlMs } : { v };
    this.scheduleSave();
  }

  // Deep copy so callers can't mutate stored state without saving (matches Redis behavior).
  private clone<T>(v: unknown): T {
    return v === undefined ? (null as T) : (JSON.parse(JSON.stringify(v)) as T);
  }

  private hashObj(hash: string): Record<string, unknown> {
    const entry = this.read(hash);
    return (entry?.v as Record<string, unknown>) || {};
  }

  async get<T>(key: string) {
    const entry = this.read(key);
    return entry ? this.clone<T>(entry.v) : null;
  }
  async set(key: string, value: unknown, ttlMs?: number) {
    this.write(key, this.clone(value), ttlMs);
  }
  async del(key: string) {
    delete this.data[key];
    this.scheduleSave();
  }
  async hget<T>(hash: string, field: string) {
    const obj = this.hashObj(hash);
    return field in obj ? this.clone<T>(obj[field]) : null;
  }
  async hset(hash: string, field: string, value: unknown) {
    const obj = { ...this.hashObj(hash), [field]: this.clone(value) };
    this.write(hash, obj);
  }
  async hsetnx(hash: string, field: string, value: unknown) {
    if (field in this.hashObj(hash)) return false;
    await this.hset(hash, field, value);
    return true;
  }
  async hdel(hash: string, field: string) {
    const obj = { ...this.hashObj(hash) };
    delete obj[field];
    this.write(hash, obj);
  }
  async hgetall<T>(hash: string) {
    return this.clone<Record<string, T>>(this.hashObj(hash));
  }
  async incr(key: string, ttlMs: number) {
    const entry = this.read(key);
    const next = (typeof entry?.v === "number" ? entry.v : 0) + 1;
    this.data[key] = { v: next, exp: entry?.exp ?? Date.now() + ttlMs };
    this.scheduleSave();
    return next;
  }
  async sadd(key: string, member: string) {
    const set = new Set((this.read(key)?.v as string[]) || []);
    set.add(member);
    this.write(key, [...set]);
  }
  async srem(key: string, member: string) {
    const set = new Set((this.read(key)?.v as string[]) || []);
    set.delete(member);
    this.write(key, [...set]);
  }
  async smembers(key: string) {
    return [...((this.read(key)?.v as string[]) || [])];
  }
}

// ---------------------------------------------------------------------------
// Backend selection
// ---------------------------------------------------------------------------
function createKV(): KVStore {
  // Vercel's Upstash integration sets KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    return new UpstashKV(new Redis({ url, token }));
  }

  if (process.env.VERCEL) {
    // Vercel's filesystem does not persist; refuse to silently lose user accounts.
    throw new Error(
      "Upstash Redis is not configured. Add the Upstash integration in Vercel (Storage tab) " +
        "so KV_REST_API_URL and KV_REST_API_TOKEN are set."
    );
  }

  return new LocalFileKV(path.join(process.cwd(), "data", "kv.json"));
}

let instance: KVStore | null = null;

export function kv(): KVStore {
  if (!instance) instance = createKV();
  return instance;
}

/** Test hook: swap the backend (e.g. for an isolated in-memory store). */
export function setKVForTesting(store: KVStore) {
  instance = store;
}
