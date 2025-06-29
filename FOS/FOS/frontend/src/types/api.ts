// src/types/api.ts

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

// Error response structure
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    field?: string;
    timestamp: string;
    requestId?: string;
    stack?: string; // Only in development
  };
}

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  code: string;
}

export interface ValidationErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    validationErrors: ValidationError[];
    timestamp: string;
    requestId?: string;
  };
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Paginated response
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
  timestamp: string;
}

// Search response with metadata
export interface SearchResponse<T> {
  success: true;
  data: T[];
  searchMeta: {
    query: string;
    total: number;
    took: number; // Search time in milliseconds
    suggestions?: string[];
    filters?: Record<string, any>;
  };
  pagination?: PaginationMeta;
  timestamp: string;
}

// File upload response
export interface FileUploadResponse {
  success: true;
  data: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
    metadata?: Record<string, any>;
  };
  message?: string;
  timestamp: string;
}

// Bulk operation response
export interface BulkOperationResponse {
  success: boolean;
  data: {
    successful: number;
    failed: number;
    total: number;
    results: Array<{
      id: string | number;
      success: boolean;
      error?: string;
    }>;
  };
  message?: string;
  timestamp: string;
}

// Authentication responses
export interface LoginResponse {
  success: true;
  data: {
    user: {
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
}
}