// src/types/auth.ts
export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  token?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: UserResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserSession {
  sessionId: number;
  userId: number;
  sessionToken: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  lastAccessed: string;
}