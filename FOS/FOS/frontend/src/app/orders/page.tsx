// src/app/orders/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Package, Filter, Search, RefreshCw, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { orderService } from '@/services/orderService';
import { OrderResponse, OrderStatus } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    loadOrders();
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, sortOrder]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const ordersData = await orderService.getUserOrders(user.userId);
      setOrders(ordersData);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Load Orders',
        message: 'Unable to load your order history. Please try again.',
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
        order.orderItems.some(item => 
          item.itemName.toLowerCase().includes(query)
        ) ||
        order.customerName.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Sort orders
    filtered.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
      case OrderStatus.CONFIRMED:
        return <Clock className="h-4 w-4" />;
      case OrderStatus.PREPARING:
        return <Package className="h-4 w-4" />;
      case OrderStatus.READY:
      case OrderStatus.COMPLETED:
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold neuro-text mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-8">
              Please sign in to view your order history
            </p>
            <Link href="/auth/login?redirect=/orders">
              <Button className="neuro-button">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold neuro-text">Order History</h1>
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${filteredOrders.length} orders found`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={loadOrders}
              className="neuro-card border-none"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/menu">
              <Button className="neuro-button">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="hybrid-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders, items, or order ID..."
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

            {/* Sort Order */}
            <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}>
              <SelectTrigger className="neuro-card border-none w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <OrdersLoadingSkeleton />
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          <EmptyOrders 
            hasFilters={searchQuery !== '' || statusFilter !== 'all'}
            onClearFilters={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          />
        )}
      </div>
    </Layout>
  );
}

// Order Card Component
interface OrderCardProps {
  order: OrderResponse;
}

function OrderCard({ order }: OrderCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <Link href={`/orders/${order.orderId}`}>
      <div className="hybrid-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="neuro-card p-3 w-12 h-12 flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold neuro-text">Order #{order.orderId}</h3>
              <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={`${getStatusColor(order.orderStatus)} border`}>
              {order.orderStatus.replace('_', ' ')}
            </Badge>
            <div className="text-right">
              <div className="font-semibold neuro-text">{formatPrice(order.totalAmount)}</div>
              <div className="text-sm text-gray-600">{order.orderItems.length} items</div>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium neuro-text mb-2">Items:</h4>
          <div className="flex flex-wrap gap-2">
            {order.orderItems.slice(0, 3).map((item) => (
              <span
                key={item.orderItemId}
                className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {item.quantity}× {item.itemName}
              </span>
            ))}
            {order.orderItems.length > 3 && (
              <span className="text-sm text-gray-500">
                +{order.orderItems.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Type: {order.orderType.replace('_', ' ')}</span>
            {order.deliveryAddress && (
              <span className="truncate max-w-48">📍 {order.deliveryAddress}</span>
            )}
          </div>
          
          {order.orderStatus !== OrderStatus.COMPLETED && order.orderStatus !== OrderStatus.CANCELLED && (
            <span className="text-blue-600 font-medium">
              Track Order →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Loading skeleton
function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="hybrid-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-neuro" />
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-20" />
              <div className="text-right">
                <Skeleton className="h-5 w-16 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Skeleton className="h-4 w-12 mb-2" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state component
interface EmptyOrdersProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

function EmptyOrders({ hasFilters, onClearFilters }: EmptyOrdersProps) {
  return (
    <div className="text-center py-16">
      <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
        <Package className="h-16 w-16 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold neuro-text mb-4">
        {hasFilters ? 'No Orders Found' : 'No Orders Yet'}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {hasFilters 
          ? 'No orders match your current filters. Try adjusting your search criteria.'
          : "You haven't placed any orders yet. Start browsing our delicious menu!"
        }
      </p>

      <div className="space-y-4">
        {hasFilters ? (
          <div className="space-x-4">
            <Button onClick={onClearFilters} variant="outline" className="neuro-card border-none">
              Clear Filters
            </Button>
            <Link href="/menu">
              <Button className="neuro-button">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <Link href="/menu">
            <Button className="neuro-button px-8 py-3">
              <Plus className="h-5 w-5 mr-2" />
              Start Ordering
            </Button>
          </Link>
        )}
        
        {/* Popular Categories */}
        <div className="glass-card p-6 max-w-md mx-auto mt-8">
          <h3 className="font-semibold glass-text mb-3">Popular Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/menu?category=1">
              <Button variant="outline" size="sm" className="interactive-glass w-full">
                🍕 Pizza
              </Button>
            </Link>
            <Link href="/menu?category=2">
              <Button variant="outline" size="sm" className="interactive-glass w-full">
                🍔 Burgers
              </Button>
            </Link>
            <Link href="/menu?category=3">
              <Button variant="outline" size="sm" className="interactive-glass w-full">
                🥗 Salads
              </Button>
            </Link>
            <Link href="/menu?category=4">
              <Button variant="outline" size="sm" className="interactive-glass w-full">
                🍰 Desserts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}