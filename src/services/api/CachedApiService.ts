import { apiService } from '../../config/api';
import RedisCache from '../cache/RedisCache';
import { FirebaseOrder } from '../../types/orders';

const cache = RedisCache.getInstance();

interface FirebaseOrdersResponse {
  success: boolean;
  count: number;
  orders: FirebaseOrder[];
  error?: string;
}

export const cachedApiService = {
  async fetchOpenOrders() {
    const cacheKey = 'orders:open';
    
    // Try to get from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached open orders');
      return cachedData;
    }

    // If not in cache, fetch from API
    const data = await apiService.fetchOpenOrders();
    
    // Store in cache
    await cache.set(cacheKey, data);
    
    return data;
  },

  async syncOrders() {
    console.group('Syncing Orders');
    console.time('Sync Operation');
    
    try {
      console.log('Starting order sync...');
      const result = await apiService.syncOrders();
      console.log('Sync completed:', result);

      console.log('Invalidating caches...');
      console.time('Cache Invalidation');
      await cache.invalidatePattern('orders:*');
      console.timeEnd('Cache Invalidation');

      console.timeEnd('Sync Operation');
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('Error in syncOrders:', error);
      console.groupEnd();
      throw error;
    }
  },

  async syncAllOrders() {
    console.group('Syncing All Orders');
    console.time('Full Sync Operation');
    
    try {
      console.log('Starting full order sync...');
      const result = await apiService.syncAllOrders();
      console.log('Full sync initiated:', result);

      console.log('Invalidating caches...');
      console.time('Cache Invalidation');
      await cache.invalidatePattern('orders:*');
      console.timeEnd('Cache Invalidation');

      console.timeEnd('Full Sync Operation');
      console.groupEnd();
      return result;
    } catch (error) {
      console.error('Error in syncAllOrders:', error);
      console.groupEnd();
      throw error;
    }
  },

  async getFirebaseOrders(page = 0, pageSize = 25) {
    const cacheKey = `firebase:orders:${page}:${pageSize}`;
    
    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) return cachedData;

      const response = await apiService.getFirebaseOrders(page, pageSize);
      await cache.set(cacheKey, response, 300); // 5 minute cache
      return response;
    } catch (error) {
      console.error('Error in getFirebaseOrders:', error);
      throw error;
    }
  },

  async getAllFirebaseOrders() {
    const cacheKey = 'firebase:all-orders';
    
    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) return cachedData;

      const response = await apiService.getAllFirebaseOrders();
      await cache.set(cacheKey, response, 3000); // 5 minute cache
      return response;
    } catch (error) {
      console.error('Error in getAllFirebaseOrders:', error);
      throw error;
    }
  }
}; 