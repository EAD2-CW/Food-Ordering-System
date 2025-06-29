// src/services/orderService.ts - Order Service API Calls

import { orderServiceApi, apiCall, API_PATHS } from './api';

// Order-related interfaces
export interface OrderItem {
  orderItemId?: number;
  orderId?: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface Order {
  orderId: number;
  userId: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  orderDate: string;
  customerNotes?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderType: OrderType;
  estimatedReadyTime?: string;
  completedAt?: string;
  staffId?: number;
  orderItems: OrderItem[];
}

export interface OrderRequestDTO {
  userId: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  customerNotes?: string;
  orderType: OrderType;
  orderItems: OrderItemRequestDTO[];
}

export interface OrderItemRequestDTO {
  itemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderResponseDTO {
  orderId: number;
  userId: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  orderDate: string;
  customerNotes?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderType: OrderType;
  estimatedReadyTime?: string;
  completedAt?: string;
  staffId?: number;
  orderItems: OrderItemResponseDTO[];
}

export interface OrderItemResponseDTO {
  orderItemId: number;
  orderId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

// Order Service API functions
export const orderService = {
  // Order Management

  // Create new order
  createOrder: async (orderData: OrderRequestDTO): Promise<OrderResponseDTO> => {
    const response = await apiCall<OrderResponseDTO>(
      orderServiceApi,
      'POST',
      API_PATHS.ORDER.CREATE,
      orderData
    );
    return response;
  },

  // Get order by ID
  getOrderById: async (orderId: number): Promise<OrderResponseDTO> => {
    const response = await apiCall<OrderResponseDTO>(
      orderServiceApi,
      'GET',
      `${API_PATHS.ORDER.GET_BY_ID}/${orderId}`
    );
    return response;
  },

  // Get orders for a specific user
  getUserOrders: async (userId: number): Promise<OrderResponseDTO[]> => {
    const response = await apiCall<OrderResponseDTO[]>(
      orderServiceApi,
      'GET',
      `${API_PATHS.ORDER.GET_USER_ORDERS}/${userId}`
    );
    return response;
  },

  // Get all orders (Staff/Admin)
  getAllOrders: async (): Promise<OrderResponseDTO[]> => {
    const response = await apiCall<OrderResponseDTO[]>(
      orderServiceApi,
      'GET',
      API_PATHS.ORDER.CREATE
    );
    return response;
  },

  // Get orders by status
  getOrdersByStatus: async (status: OrderStatus): Promise<OrderResponseDTO[]> => {
    const response = await apiCall<OrderResponseDTO[]>(
      orderServiceApi,
      'GET',
      `${API_PATHS.ORDER.GET_BY_STATUS}/${status}`
    );
    return response;
  },

  // Get active orders (not completed or cancelled)
  getActiveOrders: async (): Promise<OrderResponseDTO[]> => {
    const response = await apiCall<OrderResponseDTO[]>(
      orderServiceApi,
      'GET',
      `${API_PATHS.ORDER.CREATE}/active`
    );
    return response;
  },

  // Update order status (Staff/Admin)
  updateOrderStatus: async (
    orderId: number, 
    status: OrderStatus, 
    staffId?: number
  ): Promise<OrderResponseDTO> => {
    const params = new URLSearchParams({ status });
    if (staffId) {
      params.append('staffId', staffId.toString());
    }
    
    const response = await apiCall<OrderResponseDTO>(
      orderServiceApi,
      'PUT',
      `${API_PATHS.ORDER.UPDATE_STATUS}/${orderId}/status?${params.toString()}`
    );
    return response;
  },

  // Cancel order
  cancelOrder: async (orderId: number): Promise<void> => {
    await apiCall<void>(
      orderServiceApi,
      'DELETE',
      `${API_PATHS.ORDER.GET_BY_ID}/${orderId}`
    );
  },

  // Utility Functions

  // Calculate order total
  calculateOrderTotal: (orderItems: OrderItemRequestDTO[], menuItems: any[]): number => {
    return orderItems.reduce((total, orderItem) => {
      const menuItem = menuItems.find(item => item.itemId === orderItem.itemId);
      if (menuItem) {
        return total + (menuItem.price * orderItem.quantity);
      }
      return total;
    }, 0);
  },

  // Calculate estimated ready time
  calculateEstimatedReadyTime: (orderItems: OrderItemRequestDTO[], menuItems: any[]): Date => {
    const maxPrepTime = orderItems.reduce((maxTime, orderItem) => {
      const menuItem = menuItems.find(item => item.itemId === orderItem.itemId);
      if (menuItem && menuItem.preparationTime) {
        return Math.max(maxTime, menuItem.preparationTime);
      }
      return maxTime;
    }, 0);

    const now = new Date();
    const estimatedTime = new Date(now.getTime() + (maxPrepTime * 60000)); // Add prep time in milliseconds
    return estimatedTime;
  },

  // Format order status for display
  formatOrderStatus: (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PREPARING: 'Preparing',
      READY: 'Ready for Pickup',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return statusMap[status] || status;
  },

  // Get status color for UI
  getStatusColor: (status: OrderStatus): string => {
    const colorMap: Record<OrderStatus, string> = {
      PENDING: 'warning',
      CONFIRMED: 'secondary',
      PREPARING: 'primary',
      READY: 'success',
      COMPLETED: 'gray',
      CANCELLED: 'error',
    };
    return colorMap[status] || 'gray';
  },

  // Format order type for display
  formatOrderType: (type: OrderType): string => {
    const typeMap: Record<OrderType, string> = {
      DINE_IN: 'Dine In',
      TAKEAWAY: 'Takeaway',
      DELIVERY: 'Delivery',
    };
    return typeMap[type] || type;
  },

  // Check if order can be cancelled
  canCancelOrder: (status: OrderStatus): boolean => {
    return ['PENDING', 'CONFIRMED'].includes(status);
  },

  // Check if order can be modified
  canModifyOrder: (status: OrderStatus): boolean => {
    return status === 'PENDING';
  },

  // Get next possible statuses
  getNextStatuses: (currentStatus: OrderStatus): OrderStatus[] => {
    const statusFlow: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };
    return statusFlow[currentStatus] || [];
  },

  // Format order date/time
  formatOrderDate: (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  },

  // Format estimated ready time
  formatEstimatedTime: (dateString?: string): string => {
    if (!dateString) return 'Calculating...';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((date.getTime() - now.getTime()) / 60000);
    
    if (diffMinutes <= 0) return 'Ready now';
    if (diffMinutes < 60) return `${diffMinutes} minutes`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  },

  // Calculate order summary
  getOrderSummary: (order: OrderResponseDTO) => {
    const itemCount = order.orderItems.reduce((count, item) => count + item.quantity, 0);
    const subtotal = order.orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Calculate tax (example: 8.5%)
    const taxRate = 0.085;
    const tax = subtotal * taxRate;
    
    // Calculate delivery fee for delivery orders
    const deliveryFee = order.orderType === 'DELIVERY' ? 3.99 : 0;
    
    const total = subtotal + tax + deliveryFee;
    
    return {
      itemCount,
      subtotal,
      tax,
      deliveryFee,
      total,
    };
  },

  // Filter orders by date range
  filterOrdersByDateRange: (
    orders: OrderResponseDTO[], 
    startDate: Date, 
    endDate: Date
  ): OrderResponseDTO[] => {
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  },

  // Group orders by status
  groupOrdersByStatus: (orders: OrderResponseDTO[]): Record<OrderStatus, OrderResponseDTO[]> => {
    return orders.reduce((groups, order) => {
      if (!groups[order.orderStatus]) {
        groups[order.orderStatus] = [];
      }
      groups[order.orderStatus].push(order);
      return groups;
    }, {} as Record<OrderStatus, OrderResponseDTO[]>);
  },

  // Get order statistics
  getOrderStatistics: (orders: OrderResponseDTO[]) => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(order => order.orderStatus === 'COMPLETED')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const statusCounts = orders.reduce((counts, order) => {
      counts[order.orderStatus] = (counts[order.orderStatus] || 0) + 1;
      return counts;
    }, {} as Record<OrderStatus, number>);
    
    const typeCounts = orders.reduce((counts, order) => {
      counts[order.orderType] = (counts[order.orderType] || 0) + 1;
      return counts;
    }, {} as Record<OrderType, number>);
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusCounts,
      typeCounts,
    };
  },

  // Validate order data
  validateOrderData: (orderData: OrderRequestDTO): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!orderData.userId || orderData.userId <= 0) {
      errors.push('Valid user ID is required');
    }

    if (!orderData.customerName || orderData.customerName.trim().length === 0) {
      errors.push('Customer name is required');
    }

    if (!orderData.customerPhone || orderData.customerPhone.trim().length === 0) {
      errors.push('Customer phone is required');
    }

    if (orderData.orderType === 'DELIVERY' && (!orderData.deliveryAddress || orderData.deliveryAddress.trim().length === 0)) {
      errors.push('Delivery address is required for delivery orders');
    }

    if (!orderData.orderItems || orderData.orderItems.length === 0) {
      errors.push('At least one order item is required');
    }

    orderData.orderItems.forEach((item, index) => {
      if (!item.itemId || item.itemId <= 0) {
        errors.push(`Item ${index + 1}: Valid item ID is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Format phone number
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  // Search orders
  searchOrders: (orders: OrderResponseDTO[], searchTerm: string): OrderResponseDTO[] => {
    const term = searchTerm.toLowerCase();
    return orders.filter(order => 
      order.orderId.toString().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.customerPhone.includes(term) ||
      order.orderItems.some(item => item.itemName.toLowerCase().includes(term))
    );
  },

  // Sort orders
  sortOrders: (
    orders: OrderResponseDTO[], 
    sortBy: 'date' | 'total' | 'status' | 'customer',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): OrderResponseDTO[] => {
    return [...orders].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          break;
        case 'total':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'status':
          comparison = a.orderStatus.localeCompare(b.orderStatus);
          break;
        case 'customer':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  },

  // Get recent orders
  getRecentOrders: (orders: OrderResponseDTO[], limit: number = 10): OrderResponseDTO[] => {
    return orderService.sortOrders(orders, 'date', 'desc').slice(0, limit);
  },

  // Check if order is recent (within last 24 hours)
  isRecentOrder: (orderDate: string): boolean => {
    const order = new Date(orderDate);
    const now = new Date();
    const timeDiff = now.getTime() - order.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24;
  },
};

// Export default
export default orderService;