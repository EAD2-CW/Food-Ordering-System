// src/lib/constants.ts

// File upload constants
export const FILE_UPLOAD = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  uploadTimeout: 30000, // 30 seconds
  maxSimultaneousUploads: 5
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  PROFILE: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Categories
  CATEGORIES: '/categories',
  ACTIVE_CATEGORIES: '/categories/active',
  
  // Menu Items
  MENU_ITEMS: '/menu-items',
  MENU_ITEMS_BY_CATEGORY: (categoryId: string) => `/menu-items/category/${categoryId}`,
  POPULAR_ITEMS: '/menu-items/popular',
  SEARCH_MENU_ITEMS: '/menu-items/search',
  
  // Orders
  ORDERS: '/orders',
  USER_ORDERS: '/orders/user',
  ORDER_TRACKING: (orderId: string) => `/orders/${orderId}/tracking`,
  CANCEL_ORDER: (orderId: string) => `/orders/${orderId}/cancel`,
  UPDATE_ORDER_STATUS: (orderId: string) => `/orders/${orderId}/status`,
  SEARCH_ORDERS: '/orders/search',
  
  // Uploads
  UPLOAD: '/upload',
  UPLOAD_AVATAR: '/upload/avatar',
  UPLOAD_MENU_ITEM: '/upload/menu-item',
  UPLOAD_CATEGORY: '/upload/category',
  DELETE_FILE: (filename: string) => `/upload/${filename}`,
  FILE_INFO: (filename: string) => `/upload/${filename}/info`
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Order status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  ONLINE: 'ONLINE'
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10
};

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export type Theme = keyof typeof THEMES;

// Language constants
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr'
} as const;

export type Language = keyof typeof LANGUAGES;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500
};

// Z-index values
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600
};