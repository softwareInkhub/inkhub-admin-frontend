import React, { createContext, useContext, useCallback } from 'react';
import RedisCache from '../services/cache/RedisCache';

interface CacheContextType {
  invalidateCache: (pattern: string) => Promise<void>;
  clearAllCache: () => Promise<void>;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cache = RedisCache.getInstance();

  const invalidateCache = useCallback(async (pattern: string) => {
    await cache.invalidatePattern(pattern);
  }, []);

  const clearAllCache = useCallback(async () => {
    await cache.invalidatePattern('*');
  }, []);

  return (
    <CacheContext.Provider value={{ invalidateCache, clearAllCache }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}; 