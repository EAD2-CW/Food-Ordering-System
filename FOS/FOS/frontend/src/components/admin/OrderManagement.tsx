// src/components/admin/OrderManagement.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Clock, Package, CheckCircle, X, Search, Filter, Eye } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { OrderResponse, OrderStatus } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await orderService.getAllOrders();
      // Sort by newest first
      const sortedOrders = ordersData.sort((a, b) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
      setOrders(sortedOrders);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Load Orders',
        message: 'Unable to load orders. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toString().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.includes(query) ||
        order.orderItems.some(item => 
          item.itemName.toLowerCase().includes(query)
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, user?.userId);
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? { ...order, orderStatus: newStatus, staffId: user?.userId }
            : order
        )
      );

      addNotification({
        type: 'success',
        title: 'Order Updated',
        message: `Order #${orderId} status updated to ${newStatus.toLowerCase()}`,
      });
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update order status.',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.PREPARING:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case OrderStatus.READY:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return OrderStatus.CONFIRMED;
      case OrderStatus.CONFIRMED:
        return OrderStatus.PREPARING;
      case OrderStatus.PREPARING:
        return OrderStatus.READY;
      case OrderStatus.READY:
        return OrderStatus.COMPLETED;
      default:
        return null;
    }
  };

  const canUpdateStatus = (status: OrderStatus) => {
    return status !== OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="hybrid-card p-6">
            <div className="animate-pulse flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-neuro"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neuro-text">Order Management</h1>
          <p className="text-gray-600">{filteredOrders.length} orders found</p>
        </div>
        <Button onClick={loadOrders} className="neuro-button">
          Refresh Orders
        </Button>
      </div>

      {/* Filters */}
      <div className="hybrid-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by order ID, customer name, phone, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neuro-input pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="neuro-card border-none w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
              <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
              <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
              <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="hybrid-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="neuro-card p-3 w-12 h-12 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold neuro-text">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.customerName} • {formatDate(order.orderDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(order.orderStatus)} border`}>
                    {order.orderStatus.replace('_', ' ')}
                  </Badge>
                  <span className="font-semibold neuro-text">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Order Type</p>
                  <p className="font-medium">{order.orderType.replace('_', ' ')}</p>
                  {order.deliveryAddress && (
                    <p className="text-sm text-gray-600 truncate">{order.deliveryAddress}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                  <p className="font-medium">{order.orderItems.length} items</p>
                  <p className="text-sm text-gray-600">
                    {order.orderItems.slice(0, 2).map(item => item.itemName).join(', ')}
                    {order.orderItems.length > 2 && '...'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetails(true);
                    }}
                    className="neuro-card border-none"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  {canUpdateStatus(order.orderStatus) && (
                    <>
                      {getNextStatus(order.orderStatus) && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const nextStatus = getNextStatus(order.orderStatus);
                            if (nextStatus) {
                              handleStatusUpdate(order.orderId, nextStatus);
                            }
                          }}
                          className="neuro-button"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as {getNextStatus(order.orderStatus)?.replace('_', ' ')}
                        </Button>
                      )}
                      
                      {order.orderStatus === OrderStatus.PENDING && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.orderId, OrderStatus.CANCELLED)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold neuro-text mb-2">No Orders Found</h2>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' 
              ? 'No orders match your current filters.' 
              : 'No orders have been placed yet.'
            }
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="glass-card border-none max-w-2xl">
          <DialogHeader>
            <DialogTitle className="glass-text">
              Order #{selectedOrder?.orderId} Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium glass-text mb-2">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-white/60">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-white/60">Phone:</span> {selectedOrder.customerPhone}</p>
                    <p><span className="text-white/60">Type:</span> {selectedOrder.orderType.replace('_', ' ')}</p>
                    {selectedOrder.deliveryAddress && (
                      <p><span className="text-white/60">Address:</span> {selectedOrder.deliveryAddress}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium glass-text mb-2">Order Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-white/60">Status:</span> {selectedOrder.orderStatus}</p>
                    <p><span className="text-white/60">Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                    <p><span className="text-white/60">Total:</span> {formatPrice(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium glass-text mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.orderItemId} className="glass-card p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium glass-text">{item.itemName}</p>
                        <p className="text-sm text-white/60">
                          {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-xs text-white/50 italic">
                            "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                      <p className="font-semibold glass-text">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.customerNotes && (
                <div>
                  <h4 className="font-medium glass-text mb-2">Customer Notes</h4>
                  <p className="text-sm text-white/80 italic">
                    "{selectedOrder.customerNotes}"
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}