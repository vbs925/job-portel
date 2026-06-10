const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

/**
 * A utility class to handle all API requests to the Express backend.
 */
export const API = {
  /**
   * Generic GET request
   */
  get: async (endpoint: string, token?: string) => {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }
      return data;
    } catch (error) {
      console.error(`API GET Error (${endpoint}):`, error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any, token?: string) => {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'API Error');
      }
      return responseData;
    } catch (error) {
      console.error(`API POST Error (${endpoint}):`, error);
      throw error;
    }
  },

  put: async (endpoint: string, data: any, token?: string) => {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'API Error');
      }
      return responseData;
    } catch (error) {
      console.error(`API PUT Error (${endpoint}):`, error);
      throw error;
    }
  },

  delete: async (endpoint: string, data?: any, token?: string) => {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'API Error');
      }
      return responseData;
    } catch (error) {
      console.error(`API DELETE Error (${endpoint}):`, error);
      throw error;
    }
  },
};
