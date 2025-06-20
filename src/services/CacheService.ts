type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

class CacheService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static cache: Record<string, CacheEntry<any>> = {};

  static get<T>(key: string): T | null {
    const entry = this.cache[key];
    if (!entry) return null;

    // Return null if cache entry has expired
    if (Date.now() > entry.expiresAt) {
      delete this.cache[key];
      return null;
    }

    return entry.data;
  }

  static set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttlMinutes * 60 * 1000;

    this.cache[key] = {
      data,
      timestamp,
      expiresAt,
    };
  }

  static invalidate(keyPrefix: string): void {
    Object.keys(this.cache).forEach((key) => {
      if (key.startsWith(keyPrefix)) {
        delete this.cache[key];
      }
    });
  }
}

export default CacheService;
