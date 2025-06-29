// src/services/authService.ts - Authentication Service for Food Ordering System

import { 
  userService, 
  LoginRequestDTO, 
  UserRegistrationDTO, 
  UserResponseDTO, 
  LoginResponse 
} from './userService';
import toast from 'react-hot-toast';

/**
 * Authentication Service
 * 
 * This service provides a clean interface for authentication operations
 * by wrapping the userService methods with additional auth-specific logic.
 * It handles login, registration, logout, and auth state management.
 */
export const authService = {
  // ====================
  // AUTHENTICATION METHODS
  // ====================

  /**
   * Authenticate user with email and password
   * @param credentials - User login credentials
   * @returns Promise<LoginResponse> - User data and token
   */
  login: async (credentials: LoginRequestDTO): Promise<LoginResponse> => {
    try {
      const response = await userService.login(credentials);
      
      // Additional auth-specific logic can be added here
      console.log('User authenticated successfully:', response.user.email);
      
      return response;
    } catch (error: any) {
      console.error('Authentication failed:', error);
      throw error;
    }
  },

  /**
   * Register new user account
   * @param userData - User registration data
   * @returns Promise<UserResponseDTO> - Created user data
   */
  register: async (userData: UserRegistrationDTO): Promise<UserResponseDTO> => {
    try {
      // Validate registration data before sending
      const validationErrors = authService.validateRegistrationData(userData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const response = await userService.register(userData);
      
      console.log('User registered successfully:', response.email);
      
      return response;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Logout current user
   * Clears all auth data and redirects to login
   */
  logout: (): void => {
    try {
      const currentUser = userService.getCurrentUser();
      userService.logout();
      
      console.log('User logged out:', currentUser?.email || 'Unknown');
      
      // Optional: Add logout analytics or cleanup here
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      userService.logout();
    }
  },

  // ====================
  // AUTH STATUS METHODS
  // ====================

  /**
   * Check if user is currently authenticated
   * @returns boolean - Authentication status
   */
  isAuthenticated: (): boolean => {
    return userService.isAuthenticated();
  },

  /**
   * Get current authenticated user
   * @returns UserResponseDTO | null - Current user or null if not authenticated
   */
  getCurrentUser: (): UserResponseDTO | null => {
    return userService.getCurrentUser();
  },

  /**
   * Get current authentication token
   * @returns string | null - Auth token or null if not authenticated
   */
  getAuthToken: (): string | null => {
    return userService.getAuthToken();
  },

  /**
   * Check authentication status and refresh if needed
   * @returns boolean - Current authentication status
   */
  checkAuthStatus: (): boolean => {
    const isAuth = userService.isAuthenticated();
    const user = userService.getCurrentUser();
    const token = userService.getAuthToken();

    // If any auth component is missing, logout
    if (!isAuth || !user || !token) {
      authService.logout();
      return false;
    }

    return true;
  },

  // ====================
  // ROLE & PERMISSION METHODS
  // ====================

  /**
   * Check if user has specific role
   * @param role - Role to check
   * @returns boolean - Whether user has the role
   */
  hasRole: (role: string): boolean => {
    return userService.hasRole(role);
  },

  /**
   * Check if user is admin
   * @returns boolean - Whether user is admin
   */
  isAdmin: (): boolean => {
    return userService.isAdmin();
  },

  /**
   * Check if user is staff (staff or admin)
   * @returns boolean - Whether user is staff
   */
  isStaff: (): boolean => {
    return userService.isStaff();
  },

  /**
   * Check if user is customer
   * @returns boolean - Whether user is customer
   */
  isCustomer: (): boolean => {
    return userService.hasRole('CUSTOMER');
  },

  /**
   * Get user's role
   * @returns string - User's role or 'GUEST' if not authenticated
   */
  getUserRole: (): string => {
    const user = userService.getCurrentUser();
    return user?.role || 'GUEST';
  },

  // ====================
  // USER INFO METHODS
  // ====================

  /**
   * Get user's full name
   * @returns string - User's full name
   */
  getUserFullName: (): string => {
    return userService.getUserFullName();
  },

  /**
   * Get user's initials for avatar
   * @returns string - User's initials
   */
  getUserInitials: (): string => {
    return userService.getUserInitials();
  },

  /**
   * Get user's email
   * @returns string - User's email or empty string if not authenticated
   */
  getUserEmail: (): string => {
    const user = userService.getCurrentUser();
    return user?.email || '';
  },

  /**
   * Get user's ID
   * @returns number | null - User's ID or null if not authenticated
   */
  getUserId: (): number | null => {
    const user = userService.getCurrentUser();
    return user?.userId || null;
  },

  // ====================
  // PROFILE MANAGEMENT
  // ====================

  /**
   * Update user profile
   * @param userData - Updated user data
   * @returns Promise<UserResponseDTO> - Updated user data
   */
  updateProfile: async (userData: Partial<UserRegistrationDTO>): Promise<UserResponseDTO> => {
    const userId = authService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await userService.updateProfile(userId, userData);
      console.log('Profile updated successfully');
      return response;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise<void>
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    // Validate new password
    const validation = userService.validatePassword(newPassword);
    if (!validation.isValid) {
      throw new Error(validation.message || 'Invalid password');
    }

    // Update profile with new password
    await authService.updateProfile({ 
      password: newPassword 
    });
  },

  // ====================
  // VALIDATION METHODS
  // ====================

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean - Whether email is valid
   */
  validateEmail: (email: string): boolean => {
    return userService.validateEmail(email);
  },

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns object - Validation result with message
   */
  validatePassword: (password: string): { isValid: boolean; message?: string } => {
    return userService.validatePassword(password);
  },

  /**
   * Check if email already exists
   * @param email - Email to check
   * @returns Promise<boolean> - Whether email exists
   */
  checkEmailExists: async (email: string): Promise<boolean> => {
    try {
      return await userService.checkEmailExists(email);
    } catch (error) {
      console.error('Email check failed:', error);
      return false;
    }
  },

  /**
   * Validate registration data
   * @param userData - Registration data to validate
   * @returns string[] - Array of validation errors
   */
  validateRegistrationData: (userData: UserRegistrationDTO): string[] => {
    const errors: string[] = [];

    // Email validation
    if (!userData.email || !authService.validateEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    // Password validation
    const passwordValidation = authService.validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.message || 'Invalid password');
    }

    // Name validation
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // Phone validation (optional)
    if (userData.phoneNumber && userData.phoneNumber.trim().length > 0) {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(userData.phoneNumber)) {
        errors.push('Invalid phone number format');
      }
    }

    return errors;
  },

  /**
   * Validate login data
   * @param credentials - Login credentials to validate
   * @returns string[] - Array of validation errors
   */
  validateLoginData: (credentials: LoginRequestDTO): string[] => {
    const errors: string[] = [];

    if (!credentials.email || !authService.validateEmail(credentials.email)) {
      errors.push('Valid email is required');
    }

    if (!credentials.password || credentials.password.length < 1) {
      errors.push('Password is required');
    }

    return errors;
  },

  // ====================
  // ERROR HANDLING
  // ====================

  /**
   * Handle authentication errors
   * @param error - Error to handle
   */
  handleAuthError: (error: any): void => {
    console.error('Authentication error:', error);
    
    // Handle specific error types
    if (error.status === 401) {
      // Unauthorized - force logout
      authService.logout();
      toast.error('Your session has expired. Please login again.');
    } else if (error.status === 403) {
      // Forbidden
      toast.error('You do not have permission to perform this action.');
    } else if (error.status === 429) {
      // Too many requests
      toast.error('Too many login attempts. Please try again later.');
    } else {
      // Generic error
      const message = error.message || 'An authentication error occurred';
      toast.error(message);
    }
  },

  // ====================
  // UTILITY METHODS
  // ====================

  /**
   * Format user address
   * @returns string - Formatted address
   */
  formatUserAddress: (): string => {
    return userService.formatUserAddress();
  },

  /**
   * Get user's display name for UI
   * @returns string - Display name
   */
  getDisplayName: (): string => {
    const user = userService.getCurrentUser();
    if (!user) return 'Guest';
    
    return user.firstName ? 
      `${user.firstName} ${user.lastName}` : 
      user.email.split('@')[0];
  },

  /**
   * Check if user account is complete
   * @returns boolean - Whether profile is complete
   */
  isProfileComplete: (): boolean => {
    const user = userService.getCurrentUser();
    if (!user) return false;

    return !!(
      user.firstName && 
      user.lastName && 
      user.email && 
      user.phoneNumber
    );
  },

  /**
   * Get required profile fields that are missing
   * @returns string[] - Array of missing fields
   */
  getMissingProfileFields: (): string[] => {
    const user = userService.getCurrentUser();
    if (!user) return ['All fields'];

    const missing: string[] = [];

    if (!user.firstName) missing.push('First Name');
    if (!user.lastName) missing.push('Last Name');
    if (!user.phoneNumber) missing.push('Phone Number');
    if (!user.address) missing.push('Address');

    return missing;
  },

  /**
   * Auto-logout after inactivity
   * @param minutes - Minutes of inactivity before logout
   */
  setupAutoLogout: (minutes: number = 30): void => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        toast.error('Session expired due to inactivity');
        authService.logout();
      }, minutes * 60 * 1000);
    };

    // Reset timer on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Start initial timer
    resetTimer();
  },
};

// ====================
// TYPE EXPORTS
// ====================

// Re-export types for convenience
export type {
  LoginRequestDTO,
  UserRegistrationDTO,
  UserResponseDTO,
  LoginResponse,
} from './userService';

// ====================
// DEFAULT EXPORT
// ====================

export default authService;