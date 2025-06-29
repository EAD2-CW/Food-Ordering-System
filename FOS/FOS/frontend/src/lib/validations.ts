// src/lib/validations.ts
import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
});

// Menu validation schemas
export const categorySchema = z.object({
  categoryName: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  displayOrder: z.number().min(0, 'Display order must be non-negative').default(0),
});

export const menuItemSchema = z.object({
  categoryId: z.number().min(1, 'Category is required'),
  itemName: z.string().min(2, 'Item name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  preparationTime: z.number().min(1, 'Preparation time must be at least 1 minute').optional(),
  ingredients: z.string().optional(),
  dietaryInfo: z.string().optional(),
  calories: z.number().min(0, 'Calories must be non-negative').optional(),
});

// Order validation schemas
export const orderItemSchema = z.object({
  itemId: z.number().min(1, 'Item ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  specialInstructions: z.string().max(200, 'Special instructions must be less than 200 characters').optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerPhone: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
  deliveryAddress: z.string().optional(),
  customerNotes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  orderType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
  orderItems: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query must be less than 100 characters'),
  category: z.number().optional(),
  minPrice: z.number().min(0, 'Minimum price must be non-negative').optional(),
  maxPrice: z.number().min(0, 'Maximum price must be non-negative').optional(),
  isAvailable: z.boolean().optional(),
  dietaryInfo: z.array(z.string()).optional(),
  sortBy: z.enum(['name', 'price', 'preparation', 'calories']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Review validation schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must be less than 500 characters'),
  orderId: z.number().min(1, 'Order ID is required'),
});

// Admin user management schema
export const userManagementSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['CUSTOMER', 'STAFF', 'ADMIN']),
  phoneNumber: z.string()
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
});

// Promo code validation
export const promoCodeSchema = z.object({
  code: z.string()
    .min(3, 'Promo code must be at least 3 characters')
    .max(20, 'Promo code must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Promo code must contain only uppercase letters and numbers'),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be a JPEG, PNG, or WebP image'
    ),
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Validation helper functions
export function validateField<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });
  
  return { success: false, errors };
}

export function getFirstError(errors: Record<string, string>): string | null {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey] : null;
}

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type UserManagementData = z.infer<typeof userManagementSchema>;
export type PromoCodeData = z.infer<typeof promoCodeSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;