// src/components/order/OrderTracking.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Circle, Truck, ChefHat, Bell, Package } from 'lucide-react';
import { OrderResponse, OrderStatus } from '@/types/order';
import { orderService } from '@/services/orderService';
import { useNotification } from '@/context/NotificationContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderTrackingProps {
  orderId: number;
  initialOrder?: OrderResponse;
}

export default function OrderTracking({ orderId, initialOrder }: OrderTrackingProps) {
  const [order, setOrder] = useState<OrderResponse | null>(initialOrder || null);
  const [isLoading, setIsLoading] = useState(!initialOrder);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!initialOrder) {
      loadOrderDetails();
    }

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      loadOrderDetails(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [orderId, initialOrder]);

  const loadOrderDetails = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const orderData = await orderService.getOrder(orderId);
      
      // Check if status changed
      if (order && order.orderStatus !== orderData.orderStatus) {
        addNotification({
          type: 'info',
          title: 'Order Status Updated',
          message: `Your order is now ${orderData.orderStatus.toLowerCase()}`,
          duration: 5000,
        });
      }
      
      setOrder(orderData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load order details:', error);
      if (showLoading) {
        addNotification({
          type: 'error',
          title: 'Failed to Load Order',
          message: 'Unable to load order details. Please try again.',
        });
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.CONFIRMED:
        return 'status-confirmed';
      case OrderStatus.PREPARING:
        return 'status-preparing';
      case OrderStatus.READY:
        return 'status-ready';
      case OrderStatus.COMPLETED:
        return 'status-completed';
      case OrderStatus.CANCELLED:
        return 'border-red-400/30 bg-red-100/20';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status: OrderStatus, isActive: boolean, isCompleted: boolean) => {
    const iconClass = `h-5 w-5 ${isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}`;
    
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className={iconClass} />;
      case OrderStatus.CONFIRMED:
        return isCompleted ? <CheckCircle className={iconClass} /> : <Circle className={iconClass} />;
      case OrderStatus.PREPARING:
        return <ChefHat className={iconClass} />;
      case OrderStatus.READY:
        return <Bell className={iconClass} />;
      case OrderStatus.COMPLETED:
        return <CheckCircle className={iconClass} />;
      default:
        return <Circle className={iconClass} />;
    }
  };

  const getEstimatedTime = () => {
    if (!order) return null;
    
    if (order.estimatedReadyTime) {
      const estimatedTime = new Date(order.estimatedReadyTime);
      const now = new Date();
      
      if (estimatedTime > now) {
        const diffMinutes = Math.ceil((estimatedTime.getTime() - now.getTime()) / (1000 * 60));
        return `${diffMinutes} minutes`;
      }
    }
    
    return null;
  };

  const trackingSteps = [
    {
      status: OrderStatus.PENDING,
      title: 'Order Placed',
      description: 'Your order has been received',
    },
    {
      status: OrderStatus.CONFIRMED,
      title: 'Order Confirmed',
      description: 'Restaurant has confirmed your order',
    },
    {
      status: OrderStatus.PREPARING,
      title: 'Preparing',
      description: 'Your food is being prepared',
    },
    {
      status: OrderStatus.READY,
      title: 'Ready',
      description: order?.orderType === 'DELIVERY' ? 'Out for delivery' : 'Ready for pickup',
    },
    {
      status: OrderStatus.COMPLETED,
      title: 'Completed',
      description: order?.orderType === 'DELIVERY' ? 'Delivered' : 'Picked up',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="hybrid-card p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const currentStatusIndex = trackingSteps.findIndex(step => step.status === order.orderStatus);
  const estimatedTime = getEstimatedTime();

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className={`glass-card p-6 ${getStatusColor(order.orderStatus)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold glass-text">Order #{order.orderId}</h2>
            <p className="glass-text opacity-80">
              Placed on {formatDateTime(order.orderDate)}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${getStatusColor(order.orderStatus)} border-none`}
          >
            {order.orderStatus.replace('_', ' ')}
          </Badge>
        </div>

        {/* Estimated Time */}
        {estimatedTime && order.orderStatus !== OrderStatus.COMPLETED && (
          <div className="glass-card p-4">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-white/70" />
              <span className="glass-text font-medium">
                Estimated {order.orderType === 'DELIVERY' ? 'delivery' : 'ready'} time: {estimatedTime}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Order Progress */}
      <div className="hybrid-card p-6">
        <h3 className="text-lg font-semibold neuro-text mb-6">Order Progress</h3>
        
        <div className="space-y-6">
          {trackingSteps.map((step, index) => {
            const isCompleted = index < currentStatusIndex;
            const isActive = index === currentStatusIndex;
            const isFuture = index > currentStatusIndex;

            return (
              <div key={step.status} className="flex items-center space-x-4">
                {/* Status Icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'border-green-500 bg-green-100' 
                    : isActive 
                    ? 'border-blue-500 bg-blue-100' 
                    : 'border-gray-300 bg-gray-100'
                }`}>
                  {getStatusIcon(step.status, isActive, isCompleted)}
                </div>

                {/* Connection Line */}
                {index < trackingSteps.length - 1 && (
                  <div className={`absolute left-[49px] w-0.5 h-6 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} style={{ top: `${(index + 1) * 80 + 40}px` }} />
                )}

                {/* Step Content */}
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    isCompleted || isActive ? 'neuro-text' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${
                    isCompleted || isActive ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                  {isActive && estimatedTime && (
                    <p className="text-xs text-blue-600 mt-1">
                      ETA: {estimatedTime}
                    </p>
                  )}
                </div>

                {/* Time stamp */}
                <div className="text-right">
                  {isCompleted && (
                    <p className="text-xs text-gray-500">
                      {index === 0 ? formatDateTime(order.orderDate) : 'Completed'}
                    </p>
                  )}
                  {isActive && (
                    <p className="text-xs text-blue-600 font-medium">
                      In Progress
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Last Updated */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadOrderDetails()}
            className="neuro-card border-none"
          >
            Refresh Status
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="hybrid-card p-6">
        <h3 className="text-lg font-semibold neuro-text mb-4">Order Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div>
            <h4 className="font-medium neuro-text mb-3">Customer Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Name:</span> {order.customerName}</p>
              <p><span className="text-gray-600">Phone:</span> {order.customerPhone}</p>
              <p><span className="text-gray-600">Order Type:</span> {order.orderType.replace('_', ' ')}</p>
              {order.deliveryAddress && (
                <p><span className="text-gray-600">Address:</span> {order.deliveryAddress}</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h4 className="font-medium neuro-text mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Total Amount:</span> {formatPrice(order.totalAmount)}</p>
              <p><span className="text-gray-600">Items:</span> {order.orderItems.length}</p>
              {order.estimatedReadyTime && (
                <p><span className="text-gray-600">Estimated Ready:</span> {formatDateTime(order.estimatedReadyTime)}</p>
              )}
              {order.completedAt && (
                <p><span className="text-gray-600">Completed:</span> {formatDateTime(order.completedAt)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Special Notes */}
        {order.customerNotes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium neuro-text mb-2">Special Instructions</h4>
            <p className="text-sm text-gray-600 italic">"{order.customerNotes}"</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="hybrid-card p-6">
        <h3 className="text-lg font-semibold neuro-text mb-4">Items Ordered</h3>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.orderItemId} className="flex items-center justify-between p-4 neuro-card">
              <div className="flex-1">
                <h4 className="font-medium neuro-text">{item.itemName}</h4>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
                {item.specialInstructions && (
                  <p className="text-xs text-gray-500 italic mt-1">
                    "{item.specialInstructions}"
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold neuro-text">{formatPrice(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-semibold neuro-text">Total:</span>
          <span className="font-bold text-lg neuro-text">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Actions */}
      {order.orderStatus === OrderStatus.PENDING && (
        <div className="glass-card p-6 text-center">
          <p className="glass-text mb-4">
            Need to make changes to your order?
          </p>
          <Button variant="outline" className="interactive-glass">
            Contact Restaurant
          </Button>
        </div>
      )}

      {order.orderStatus === OrderStatus.COMPLETED && (
        <div className="glass-card p-6 text-center">
          <h4 className="font-semibold glass-text mb-2">Order Completed!</h4>
          <p className="glass-text mb-4">
            Thank you for your order. We hope you enjoyed your meal!
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="interactive-glass">
              Rate Order
            </Button>
            <Button className="neuro-button">
              Order Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}