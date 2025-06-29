// src/lib/auth.ts
import { UserRole } from '@/types/auth';

export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    removeStoredUser();
    return null;
  }
}

export function setStoredUser(user: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_DATA_KEY);
}

export function clearAuthData(): void {
  removeStoredToken();
  removeStoredUser();
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.CUSTOMER]: 0,
    [UserRole.STAFF]: 1,
    [UserRole.ADMIN]: 2,
  };

  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
}

export function canAccessAdminPanel(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.ADMIN);
}

export function canManageOrders(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.STAFF);
}

export function formatUserName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export function redirectToLogin(returnUrl?: string): void {
  if (typeof window === 'undefined') return;
  
  const loginUrl = returnUrl 
    ? `/auth/login?redirect=${encodeURIComponent(returnUrl)}`
    : '/auth/login';
    
  window.location.href = loginUrl;
}

export function getReturnUrl(): string {
  if (typeof window === 'undefined') return '/';
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('redirect') || '/';
}