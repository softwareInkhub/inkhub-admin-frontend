const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const endpoints = {
  openOrders: `${API_URL}/api/shopify/open-orders`,
  syncOrders: `${API_URL}/api/shopify/sync-orders`,
  syncAllOrders: `${API_URL}/api/shopify/sync-all-orders`,
  products: `${API_URL}/api/shopify/products`,
  tasks: `${API_URL}/api/tasks`,
  users: `${API_URL}/api/firebase/users`,
  firebaseOrders: `${API_URL}/api/firebase/shopify-orders`,
};

export const apiService = {
  async fetchOpenOrders() {
    const response = await fetch(endpoints.openOrders, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  async syncOrders() {
    const response = await fetch(endpoints.syncOrders, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async syncAllOrders() {
    const response = await fetch(endpoints.syncAllOrders, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getFirebaseOrders(page = 0, pageSize = 25) {
    const response = await fetch(`${API_URL}/api/firebase/shopify-orders?page=${page}&pageSize=${pageSize}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getAllFirebaseOrders() {
    const response = await fetch(`${API_URL}/api/firebase/shopify-orders/all`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}; 