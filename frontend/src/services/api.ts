import axios, { AxiosInstance } from 'axios';
import { Cart, AuthResponse, Product } from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if it exists
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async register(email: string, phone?: string): Promise<AuthResponse> {
    const response = await this.api.post('/api/users/register', { email, phone });
    return response.data;
  }

  async login(email: string): Promise<AuthResponse> {
    const response = await this.api.post('/api/users/login', { email });
    return response.data;
  }

  // Products endpoints
  async getProducts(): Promise<Product[]> {
    const response = await this.api.get('/api/products');
    return response.data;
  }

  // Cart endpoints
  async createCart(items: any[]): Promise<Cart> {
    const response = await this.api.post('/api/carts', { items });
    return response.data;
  }

  async getCart(cartId: string): Promise<Cart> {
    const response = await this.api.get(`/api/carts/${cartId}`);
    return response.data;
  }

  async updateCart(cartId: string, items: any[]): Promise<Cart> {
    const response = await this.api.put(`/api/carts/${cartId}`, { items });
    return response.data;
  }

  async deleteCart(cartId: string): Promise<void> {
    await this.api.delete(`/api/carts/${cartId}`);
  }

  async completeCart(cartId: string): Promise<Cart> {
    const response = await this.api.put(`/api/carts/${cartId}/complete`);
    return response.data;
  }

  async getUserCarts(): Promise<Cart[]> {
    const response = await this.api.get('/api/carts');
    return response.data;
  }

  // Notification endpoints
  async getNotificationHistory(): Promise<any[]> {
    const response = await this.api.get('/api/notifications/history');
    return response.data;
  }
}

export default new ApiService();
