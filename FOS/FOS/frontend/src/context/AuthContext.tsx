"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

// Import the new microservice modules
import {
  userService,
  UserResponseDTO,
  LoginRequestDTO,
  UserRegistrationDTO,
} from "@/services/userService";

// Updated User interface to match microservice response
export interface User {
  userId: number; // Changed from 'id' to 'userId' to match backend
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string; // Keep this for frontend use
}

// Updated AuthContext interface
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequestDTO) => Promise<void>;
  register: (userData: UserRegistrationDTO) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserRegistrationDTO>) => Promise<void>;
  checkAuthStatus: () => void;
  // Additional utility methods
  getUserFullName: () => string;
  getUserInitials: () => string;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from userService
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = () => {
    try {
      setLoading(true);

      const storedToken = userService.getAuthToken();
      const currentUser = userService.getCurrentUser();
      const isAuth = userService.isAuthenticated();

      if (storedToken && currentUser && isAuth) {
        // Convert UserResponseDTO to User interface
        const userData: User = {
          userId: currentUser.userId,
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          phoneNumber: currentUser.phoneNumber,
          address: currentUser.address,
          role: currentUser.role as "CUSTOMER" | "STAFF" | "ADMIN",
          createdAt: new Date().toISOString(), // Fallback if not provided
          updatedAt: new Date().toISOString(), // Fallback if not provided
        };

        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Clear invalid auth state
        logout();
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function using userService
  const login = async (credentials: LoginRequestDTO) => {
    try {
      setLoading(true);

      const response = await userService.login(credentials);

      // Convert UserResponseDTO to User interface
      const userData: User = {
        userId: response.user.userId,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        phoneNumber: response.user.phoneNumber,
        address: response.user.address,
        role: response.user.role as "CUSTOMER" | "STAFF" | "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update state
      setToken(response.token);
      setUser(userData);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${userData.firstName}!`);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function using userService
  const register = async (userData: UserRegistrationDTO) => {
    try {
      setLoading(true);

      const response = await userService.register(userData);

      // Convert UserResponseDTO to User interface
      const newUser: User = {
        userId: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: response.phoneNumber,
        address: response.address,
        role: response.role as "CUSTOMER" | "STAFF" | "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // For registration, we might need to login separately
      // or the backend might return a token directly
      setUser(newUser);

      // Note: Adjust this based on your backend registration response
      // If registration doesn't auto-login, you might need to call login after
      const token = userService.getAuthToken();
      if (token) {
        setToken(token);
        setIsAuthenticated(true);
      }

      toast.success(`Welcome to FoodOrder, ${newUser.firstName}!`);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function using userService
  const logout = () => {
    try {
      userService.logout();

      // Reset state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      toast.success("You have been logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Still reset state even if logout fails
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user function using userService
  const updateUser = async (data: Partial<UserRegistrationDTO>) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      setLoading(true);

      const response = await userService.updateProfile(user.userId, data);

      // Convert updated UserResponseDTO to User interface
      const updatedUser: User = {
        ...user,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: response.phoneNumber,
        address: response.address,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Utility method: Get user's full name
  const getUserFullName = (): string => {
    return userService.getUserFullName(
      user
        ? {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
          }
        : null
    );
  };

  // Utility method: Get user's initials
  const getUserInitials = (): string => {
    return userService.getUserInitials(
      user
        ? {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.role,
          }
        : null
    );
  };

  // Utility method: Check if user has specific role
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  // Utility method: Check if user is admin
  const isAdmin = (): boolean => {
    return userService.isAdmin();
  };

  // Utility method: Check if user is staff
  const isStaff = (): boolean => {
    return userService.isStaff();
  };

  // Handle authentication errors (called from API interceptors)
  useEffect(() => {
    const handleAuthError = () => {
      logout();
    };

    // This could be enhanced to listen for auth errors from the API layer
    // For now, we'll check auth status periodically
    const interval = setInterval(() => {
      if (isAuthenticated && !userService.isAuthenticated()) {
        handleAuthError();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Provide the context value
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus,
    getUserFullName,
    getUserInitials,
    hasRole,
    isAdmin,
    isStaff,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export types for use in other components
export type { LoginRequestDTO, UserRegistrationDTO, UserResponseDTO };
