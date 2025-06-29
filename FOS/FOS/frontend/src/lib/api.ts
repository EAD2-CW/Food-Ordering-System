// src/lib/api.ts
import axios from 'axios';

// API Base URLs for each microservice
export const API_ENDPOINTS = {
  USER_SERVICE: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8080/api',
  MENU_SERVICE: process.env.NEXT_PUBLIC_MENU_SERVICE_URL || 'http://localhost:8081/api',
  ORDER_SERVICE: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:8082/api'
};

// Axios instances for each service
export const userApi = axios.create({
  baseURL: API_ENDPOINTS.USER_SERVICE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuApi = axios.create({
  baseURL: API_ENDPOINTS.MENU_SERVICE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const orderApi = axios.create({
  baseURL: API_ENDPOINTS.ORDER_SERVICE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -------------------- Category Types --------------------
export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// -------------------- Menu Item Types --------------------
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  categoryId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------- Order Related Types --------------------
export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------- Auth Interceptors --------------------
userApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

orderApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------- Response Handlers --------------------
const handleResponse = (response: any) => response.data;

const handleError = (error: any) => {
  console.error('API Error:', error);

  if (error.response?.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  }

  throw error.response?.data || error.message;
};

userApi.interceptors.response.use(handleResponse, handleError);
menuApi.interceptors.response.use(handleResponse, handleError);
orderApi.interceptors.response.use(handleResponse, handleError);
