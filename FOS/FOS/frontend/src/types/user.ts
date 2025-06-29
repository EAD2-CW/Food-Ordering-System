// src/types/user.ts
import { UserRole } from './auth';

export interface UserProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  dietaryRestrictions: string[];
  defaultDeliveryAddress?: string;
  preferredPaymentMethod?: string;
  language: string;
  timezone: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

export interface UserActivity {
  id: number;
  userId: number;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

export interface UserStats {
  totalUsers: number;
  customerCount: number;
  staffCount: number;
  adminCount: number;
  activeUsers: number;
  newUsersThisMonth: number;
  newUsersToday: number;
  averageOrdersPerUser: number;
  topCustomers: Array<{
    userId: number;
    name: string;
    orderCount: number;
    totalSpent: number;
  }>;
}

export interface UserAddress {
  id: number;
  userId: number;
  label: string; // 'Home', 'Work', 'Other'
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPaymentMethod {
  id: number;
  userId: number;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  provider: string;
  last4Digits?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardHolderName?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UserFavorite {
  id: number;
  userId: number;
  itemId: number;
  itemName: string;
  itemPrice: number;
  categoryName: string;
  imageUrl?: string;
  addedAt: string;
}

export interface UserReview {
  id: number;
  userId: number;
  orderId: number;
  itemId?: number;
  rating: number; // 1-5
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserNotification {
  id: number;
  userId: number;
  type: 'order_update' | 'promotion' | 'system' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface UserSession {
  id: number;
  userId: number;
  sessionToken: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
}

export interface UserSearchFilters {
  query?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  lastLoginAfter?: string;
  lastLoginBefore?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'firstName' | 'email';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserCreationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  sendWelcomeEmail?: boolean;
  temporaryPassword?: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  role?: UserRole;
  isActive?: boolean;
  preferences?: Partial<UserPreferences>;
}

export interface UserPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserPasswordResetRequest {
  email: string;
}

export interface UserEmailVerificationRequest {
  email: string;
}

export interface UserPhoneVerificationRequest {
  phoneNumber: string;
}

export interface BulkUserAction {
  userIds: number[];
  action: 'activate' | 'deactivate' | 'delete' | 'change_role' | 'send_notification';
  data?: {
    role?: UserRole;
    notification?: {
      title: string;
      message: string;
      type: 'system' | 'promotion' | 'reminder';
    };
  };
}

export interface UserExportOptions {
  format: 'csv' | 'excel' | 'json';
  fields?: Array<keyof UserProfile>;
  filters?: UserSearchFilters;
  includePreferences?: boolean;
  includeAddresses?: boolean;
  includeOrderHistory?: boolean;
}

export interface UserImportData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role?: UserRole;
}

export interface UserImportResult {
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    email: string;
    error: string;
  }>;
  duplicates: Array<{
    row: number;
    email: string;
  }>;
}

export interface UserLoyaltyPoints {
  userId: number;
  totalPoints: number;
  availablePoints: number;
  tierLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsToNextTier: number;
  history: Array<{
    id: number;
    points: number;
    type: 'earned' | 'redeemed' | 'expired';
    description: string;
    orderId?: number;
    createdAt: string;
  }>;
}

export interface UserReferral {
  id: number;
  referrerId: number;
  refereeId: number;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  reward: {
    type: 'discount' | 'points' | 'free_delivery';
    value: number;
    description: string;
  };
  createdAt: string;
  completedAt?: string;
}