// src/types/common.ts
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Theme {
  mode: 'light' | 'dark';
  glassmorphism: boolean;
  neumorphism: boolean;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setGlassmorphism: (enabled: boolean) => void;
  setNeumorphism: (enabled: boolean) => void;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: any;
  suggestions?: string[];
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline' | 'glass' | 'neuro';
  size?: 'sm' | 'md' | 'lg';
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  variant?: 'glass' | 'neuro' | 'hybrid';
}