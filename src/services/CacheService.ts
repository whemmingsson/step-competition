import { getLogger } from "@/utils/LogUtils";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

class CacheService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static cache: Record<string, CacheEntry<any>> = {};
  private static logger = getLogger("CacheService");

  static get<T>(key: string): T | null {
    const entry = this.cache[key];
    if (!entry) return null;

    // Return null if cache entry has expired
    if (Date.now() > entry.expiresAt) {
      this.logger.log(`Cache expired for key: ${key}`);
      delete this.cache[key];
      return null;
    }

    this.logger.log(`Cache hit for key: ${key}`);
    return entry.data;
  }

  static set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    this.logger.log(
      `Setting cache for key: ${key} with TTL: ${ttlMinutes} minutes`
    );
    const timestamp = Date.now();
    const expiresAt = timestamp + ttlMinutes * 60 * 1000;

    this.cache[key] = {
      data,
      timestamp,
      expiresAt,
    };
  }

  static invalidate(keyPrefix: string): void {
    this.logger.log(`Trying to invalidate cache for key: ${keyPrefix}`);
    Object.keys(this.cache).forEach((key) => {
      if (key.startsWith(keyPrefix)) {
        this.logger.log(`   Invalidating cache for key: ${key}`);
        delete this.cache[key];
      }
    });
  }
}

export default CacheService;
