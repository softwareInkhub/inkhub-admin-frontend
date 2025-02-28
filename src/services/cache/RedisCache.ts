import { get, set, del, clear, keys } from 'idb-keyval';

class RedisCache {
  private static instance: RedisCache;
  private readonly DEFAULT_EXPIRY = 3600; // 1 hour in seconds

  private constructor() {
    console.log('Cache Service Initialized');
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await get(key);
      if (!data) return null;

      const { value, expiry } = data as { value: T; expiry: number };
      if (expiry && expiry < Date.now()) {
        console.log(`Cache expired for key: ${key}`);
        await this.invalidate(key);
        return null;
      }

      console.log(`Cache hit for key: ${key}`);
      return value;
    } catch (error) {
      console.error('Cache Get Error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, expiry: number = this.DEFAULT_EXPIRY): Promise<void> {
    try {
      const data = {
        value,
        expiry: Date.now() + (expiry * 1000)
      };
      await set(key, data);
      console.log(`Cached data for key: ${key}, expires in ${expiry} seconds`);
    } catch (error) {
      console.error('Cache Set Error:', error);
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await del(key);
    } catch (error) {
      console.error('Cache Invalidate Error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const allKeys = await keys();
      const matchingKeys = allKeys.filter(key => 
        typeof key === 'string' && key.includes(pattern.replace('*', ''))
      );
      
      await Promise.all(matchingKeys.map(key => this.invalidate(key as string)));
    } catch (error) {
      console.error('Cache Pattern Invalidate Error:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      await clear();
    } catch (error) {
      console.error('Cache Clear Error:', error);
    }
  }
}

export default RedisCache; 