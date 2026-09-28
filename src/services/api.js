/**
 * Grocery Mart Admin API Service
 * Connects the Admin Panel to the Express.js + MySQL backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  const authToken = token || localStorage.getItem('grocery_mart_admin_token') || localStorage.getItem('grocery_mart_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const api = {
  // Health check
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (err) {
      console.warn('Backend server is currently offline. Using local mock data.');
      return null;
    }
  },

  // Authentication
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials)
      });
      return await res.json();
    },
    getProfile: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders()
      });
      return await res.json();
    }
  },

  // Products
  products: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      return await res.json();
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      return await res.json();
    },
    getCategories: async () => {
      const res = await fetch(`${API_BASE_URL}/products/categories`);
      return await res.json();
    },
    create: async (productData) => {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      return await res.json();
    },
    update: async (id, productData) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      return await res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    }
  },

  // Orders
  orders: {
    create: async (orderData) => {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      return await res.json();
    },
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: getHeaders()
      });
      return await res.json();
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: getHeaders()
      });
      return await res.json();
    }
  },

  // Offers & Deals (Best Offers For You)
  offers: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/offers`);
      return await res.json();
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/offers/${id}`);
      return await res.json();
    },
    create: async (offerData) => {
      const res = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(offerData)
      });
      return await res.json();
    },
    update: async (id, offerData) => {
      const res = await fetch(`${API_BASE_URL}/offers/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(offerData)
      });
      return await res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/offers/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    }
  },

  // Direct Image Upload
  upload: {
    directImage: async (base64Image, filename) => {
      try {
        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ image: base64Image, filename })
        });
        const data = await res.json();
        return data?.url || base64Image;
      } catch (err) {
        console.warn('Upload API fallback to direct base64 image');
        return base64Image;
      }
    }
  },

  // Support / Contact
  contact: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        headers: getHeaders()
      });
      return await res.json();
    }
  }
};

export default api;
