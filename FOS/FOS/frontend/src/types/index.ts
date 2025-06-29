// src/types/index.ts - TypeScript Type Definitions

// Re-export all types from services for easy importing
export type {
  User,
  UserRegistrationDTO,
  LoginRequestDTO,
  UserResponseDTO,
  LoginResponse,
} from '../services/userService';

export type {
  Category,
  MenuItem,
  CategoryDTO,
  MenuItemDTO,
  MenuItemRequestDTO,
} from '../services/menuService';

export type {
  OrderItem,
  Order,
  OrderRequestDTO,
  OrderItemRequestDTO,
  OrderResponseDTO,
  OrderItemResponseDTO,
  OrderStatus,
  OrderType,
} from '../services/orderService';

export type {
  ApiResponse,
  ApiError,
} from '../services/api';

// Additional frontend-specific types

// Shopping Cart Types
export interface CartItem {
  menuItem: MenuItemDTO;
  quantity: number;
  specialInstructions?: string;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
}

// Authentication Context Types
export interface AuthState {
  isAuthenticated: boolean;
  user: UserResponseDTO | null;
  token: string | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequestDTO) => Promise<void>;
  register: (userData: UserRegistrationDTO) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<UserResponseDTO>) => void;
  checkAuthStatus: () => void;
}

// Cart Context Types
export interface CartContextType extends CartState {
  addItem: (menuItem: MenuItemDTO, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  updateSpecialInstructions: (itemId: number, instructions: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartItem: (itemId: number) => CartItem | undefined;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData extends UserRegistrationDTO {
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress?: string;
  customerNotes?: string;
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE';
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Component Props Types
export interface MenuItemCardProps {
  menuItem: MenuItemDTO;
  onAddToCart: (menuItem: MenuItemDTO, quantity: number, specialInstructions?: string) => void;
  className?: string;
}

export interface OrderCardProps {
  order: OrderResponseDTO;
  onStatusUpdate?: (orderId: number, status: OrderStatus) => void;
  onViewDetails?: (orderId: number) => void;
  showActions?: boolean;
  className?: string;
}

export interface CategoryCardProps {
  category: CategoryDTO;
  onSelect?: (categoryId: number) => void;
  isSelected?: boolean;
  className?: string;
}

// Filter and Sort Types
export interface MenuFilters {
  searchTerm: string;
  categoryId: number | null;
  dietaryFilter: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'name' | 'price' | 'time';
  sortOrder: 'asc' | 'desc';
}

export interface OrderFilters {
  status: OrderStatus | 'ALL';
  orderType: OrderType | 'ALL';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchTerm: string;
}

// API Response Wrappers
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  size: number;
  sort?: SortOptions;
}

// UI State Types
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Modal Types
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  gray: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  darkMode: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  animations: boolean;
}

// Analytics Types
export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{
    itemId: number;
    itemName: string;
    orderCount: number;
    revenue: number;
  }>;
  statusBreakdown: Record<OrderStatus, number>;
  typeBreakdown: Record<OrderType, number>;
  dailyStats: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  userRetention: number;
  roleBreakdown: Record<string, number>;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Search Types
export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  searchTerm: string;
  filters: any;
}

export interface SearchFilters {
  [key: string]: any;
}

// Layout Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavigationItem[];
  requiredRole?: string;
}

// Status Types
export interface StatusConfig {
  label: string;
  color: string;
  icon?: string;
  description?: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    color: 'warning',
    icon: 'clock',
    description: 'Order received and pending confirmation',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'secondary',
    icon: 'check-circle',
    description: 'Order confirmed and being prepared',
  },
  PREPARING: {
    label: 'Preparing',
    color: 'primary',
    icon: 'chef-hat',
    description: 'Your food is being prepared',
  },
  READY: {
    label: 'Ready',
    color: 'success',
    icon: 'bell',
    description: 'Order ready for pickup/delivery',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'gray',
    icon: 'check',
    description: 'Order completed successfully',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'error',
    icon: 'x-circle',
    description: 'Order has been cancelled',
  },
};

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableDarkMode: boolean;
    enableOfflineMode: boolean;
  };
  limits: {
    maxCartItems: number;
    maxOrderValue: number;
    sessionTimeout: number;
  };
}

// Export utility type guards
export const isOrderStatus = (value: any): value is OrderStatus => {
  return typeof value === 'string' && 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].includes(value);
};

export const isOrderType = (value: any): value is OrderType => {
  return typeof value === 'string' && 
    ['DINE_IN', 'TAKEAWAY', 'DELIVERY'].includes(value);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};