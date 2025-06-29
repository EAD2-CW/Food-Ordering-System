// src/services/api.ts - API Configuration and Base Setup

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Base URLs for each microservice
export const API_ENDPOINTS = {
  USER_SERVICE: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8083',
  MENU_SERVICE: process.env.NEXT_PUBLIC_MENU_SERVICE_URL || 'http://localhost:8081',
  ORDER_SERVICE: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:8082',
};

// API paths for each service
export const API_PATHS = {
  // User Service paths
  USER: {
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    PROFILE: '/api/users',
    EXISTS: '/api/users/exists',
  },
  // Menu Service paths
  MENU: {
    CATEGORIES: '/api/categories',
    CATEGORIES_WITH_ITEMS: '/api/categories/with-items',
    ITEMS: '/api/items',
    ITEMS_BY_CATEGORY: '/api/items/category',
    SEARCH_ITEMS: '/api/items/search',
  },
  // Order Service paths
  ORDER: {
    CREATE: '/api/orders',
    GET_BY_ID: '/api/orders',
    GET_USER_ORDERS: '/api/orders/user',
    UPDATE_STATUS: '/api/orders',
    GET_BY_STATUS: '/api/orders/status',
  },
};

// Request/Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Create axios instances for each microservice
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create instances for each microservice
export const userServiceApi = createApiInstance(API_ENDPOINTS.USER_SERVICE);
export const menuServiceApi = createApiInstance(API_ENDPOINTS.MENU_SERVICE);
export const orderServiceApi = createApiInstance(API_ENDPOINTS.ORDER_SERVICE);

// Generic API call function
export const apiCall = async <T>(
  apiInstance: AxiosInstance,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiInstance.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
    throw apiError;
  }
};

// Utility functions for common operations
export const handleApiError = (error: any): string => {
  if (error.errors) {
    // Handle validation errors
    const firstErrorKey = Object.keys(error.errors)[0];
    return error.errors[firstErrorKey][0];
  }
  return error.message || 'An unexpected error occurred';
};

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.message === 'string' && typeof error.status === 'number';
};

// Health check functions for microservices
export const checkServiceHealth = async (serviceName: string, apiInstance: AxiosInstance): Promise<boolean> => {
  try {
    await apiInstance.get('/actuator/health');
    return true;
  } catch (error) {
    console.error(`${serviceName} health check failed:`, error);
    return false;
  }
};

export const checkAllServicesHealth = async (): Promise<Record<string, boolean>> => {
  const [userHealth, menuHealth, orderHealth] = await Promise.allSettled([
    checkServiceHealth('User Service', userServiceApi),
    checkServiceHealth('Menu Service', menuServiceApi),
    checkServiceHealth('Order Service', orderServiceApi),
  ]);

  return {
    userService: userHealth.status === 'fulfilled' ? userHealth.value : false,
    menuService: menuHealth.status === 'fulfilled' ? menuHealth.value : false,
    orderService: orderHealth.status === 'fulfilled' ? orderHealth.value : false,
  };
};