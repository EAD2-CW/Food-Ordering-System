// src/services/userService.ts - User Service API Calls

import { userServiceApi, apiCall, API_PATHS } from './api';

// User-related interfaces
export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistrationDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  token?: string;
}

export interface LoginResponse {
  user: UserResponseDTO;
  token: string;
  expiresIn: number;
}

// User Service API functions
export const userService = {
  // User Registration
  register: async (userData: UserRegistrationDTO): Promise<UserResponseDTO> => {
    const response = await apiCall<UserResponseDTO>(
      userServiceApi,
      'POST',
      API_PATHS.USER.REGISTER,
      userData
    );
    return response;
  },

  // User Login
  login: async (credentials: LoginRequestDTO): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>(
      userServiceApi,
      'POST',
      API_PATHS.USER.LOGIN,
      credentials
    );
    
    // Store auth data in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Get User Profile
  getProfile: async (userId: number): Promise<UserResponseDTO> => {
    const response = await apiCall<UserResponseDTO>(
      userServiceApi,
      'GET',
      `${API_PATHS.USER.PROFILE}/${userId}`
    );
    return response;
  },

  // Update User Profile
  updateProfile: async (userId: number, userData: Partial<UserRegistrationDTO>): Promise<UserResponseDTO> => {
    const response = await apiCall<UserResponseDTO>(
      userServiceApi,
      'PUT',
      `${API_PATHS.USER.PROFILE}/${userId}`,
      userData
    );
    
    // Update stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...response };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response;
  },

  // Check if email exists
  checkEmailExists: async (email: string): Promise<boolean> => {
    const response = await apiCall<boolean>(
      userServiceApi,
      'GET',
      `${API_PATHS.USER.EXISTS}/${encodeURIComponent(email)}`
    );
    return response;
  },

  // Get all users (Admin only)
  getAllUsers: async (): Promise<UserResponseDTO[]> => {
    const response = await apiCall<UserResponseDTO[]>(
      userServiceApi,
      'GET',
      API_PATHS.USER.PROFILE
    );
    return response;
  },

  // Delete user (Admin only)
  deleteUser: async (userId: number): Promise<void> => {
    await apiCall<void>(
      userServiceApi,
      'DELETE',
      `${API_PATHS.USER.PROFILE}/${userId}`
    );
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: (): UserResponseDTO | null => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get auth token
  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const user = userService.getCurrentUser();
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    return userService.hasRole('ADMIN');
  },

  // Check if user is staff
  isStaff: (): boolean => {
    return userService.hasRole('STAFF') || userService.hasRole('ADMIN');
  },

  // Validate email format
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true };
  },

  // Get user initials for avatar
  getUserInitials: (user?: UserResponseDTO | null): string => {
    const currentUser = user || userService.getCurrentUser();
    if (!currentUser) return 'U';
    return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
  },

  // Get user full name
  getUserFullName: (user?: UserResponseDTO | null): string => {
    const currentUser = user || userService.getCurrentUser();
    if (!currentUser) return 'User';
    return `${currentUser.firstName} ${currentUser.lastName}`;
  },

  // Format user address
  formatUserAddress: (user?: UserResponseDTO | null): string => {
    const currentUser = user || userService.getCurrentUser();
    if (!currentUser?.address) return 'No address provided';
    return currentUser.address;
  },

  // Handle authentication errors
  handleAuthError: (error: any): void => {
    console.error('Authentication error:', error);
    userService.logout();
    // Redirect to login page
    window.location.href = '/auth/login';
  },
};

// Export default
export default userService;