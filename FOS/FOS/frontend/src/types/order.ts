// src/types/order.ts
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY'
}

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
  createdAt: string;
}

export interface OrderItemRequest {
  itemId: number;
  quantity: number;
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

export interface OrderRequest {
  userId: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  customerNotes?: string;
  orderType: OrderType;
  orderItems: OrderItemRequest[];
}

export interface OrderResponse {
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

export interface OrderStatusHistory {
  historyId: number;
  orderId: number;
  oldStatus?: OrderStatus;
  newStatus: OrderStatus;
  changedBy?: number;
  notes?: string;
  changedAt: string;
}

export interface OrderUpdateRequest {
  status: OrderStatus;
  staffId?: number;
  notes?: string;
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  recentOrders: OrderResponse[];
}

export interface OrderFilters {
  status?: OrderStatus;
  orderType?: OrderType;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}