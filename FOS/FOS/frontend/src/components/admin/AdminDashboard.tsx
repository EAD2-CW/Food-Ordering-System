// src/components/admin/AdminDashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Package,
  Star,
  AlertCircle
} from 'lucide-react';
import { orderService } from '@/services/orderService';
import { menuService } from '@/services/menuService';
import { authService } from '@/services/authService';
import { OrderStatus } from '@/types/order';
import { useNotification } from '@/context/NotificationContext';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingOrders: number;
  completedOrders: number;
  avgOrderValue: number;
  topSellingItems: Array<{
    itemName: string;
    orderCount: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    pendingOrders: 0,
    completedOrders: 0,
    avgOrderValue: 0,
    topSellingItems: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch data from all services
      const [orders, menuItems, users] = await Promise.all([
        orderService.getAllOrders(),
        menuService.getAllMenuItems(),
        authService.getAllUsers()
      ]);

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = orders.filter(order => 
        order.orderStatus === OrderStatus.PENDING || 
        order.orderStatus === OrderStatus.CONFIRMED ||
        order.orderStatus === OrderStatus.PREPARING ||
        order.orderStatus === OrderStatus.READY
      ).length;
      const completedOrders = orders.filter(order => 
        order.orderStatus === OrderStatus.COMPLETED
      ).length;

      // Calculate top selling items
      const itemSales = new Map<string, { count: number; revenue: number }>();
      orders.forEach(order => {
        order.orderItems.forEach(item => {
          const existing = itemSales.get(item.itemName) || { count: 0, revenue: 0 };
          itemSales.set(item.itemName, {
            count: existing.count + item.quantity,
            revenue: existing.revenue + item.subtotal
          });
        });
      });

      const topSellingItems = Array.from(itemSales.entries())
        .map(([itemName, data]) => ({
          itemName,
          orderCount: data.count,
          revenue: data.revenue
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 5);

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: users.filter(user => user.role === 'CUSTOMER').length,
        totalMenuItems: menuItems.length,
        pendingOrders,
        completedOrders,
        avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
        topSellingItems
      });
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Load Dashboard',
        message: 'Unable to load dashboard statistics.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="hybrid-card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold neuro-text mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your restaurant's performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold neuro-text">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
            <div className="neuro-card p-3">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold neuro-text">{stats.totalOrders}</p>
              <p className="text-xs text-blue-600">+{stats.pendingOrders} pending</p>
            </div>
            <div className="neuro-card p-3">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold neuro-text">{stats.totalCustomers}</p>
              <p className="text-xs text-purple-600">Active users</p>
            </div>
            <div className="neuro-card p-3">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold neuro-text">{formatCurrency(stats.avgOrderValue)}</p>
              <p className="text-xs text-orange-600">+8% from last month</p>
            </div>
            <div className="neuro-card p-3">
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Orders Alert */}
        {stats.pendingOrders > 0 && (
          <div className="glass-card border-yellow-400/30 bg-yellow-100/20 p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold glass-text">Pending Orders</h3>
                <p className="glass-text opacity-80">{stats.pendingOrders} orders need attention</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold glass-text">Menu Items</h3>
              <p className="glass-text opacity-80">{stats.totalMenuItems} items available</p>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold glass-text">Completed Orders</h3>
              <p className="glass-text opacity-80">{stats.completedOrders} orders completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="hybrid-card p-6">
        <h2 className="text-xl font-semibold neuro-text mb-6">Top Selling Items</h2>
        
        {stats.topSellingItems.length > 0 ? (
          <div className="space-y-4">
            {stats.topSellingItems.map((item, index) => (
              <div key={item.itemName} className="neuro-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="neuro-card p-2 w-8 h-8 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium neuro-text">{item.itemName}</h3>
                      <p className="text-sm text-gray-600">{item.orderCount} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold neuro-text">{formatCurrency(item.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No sales data available yet</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Summary */}
        <div className="hybrid-card p-6">
          <h2 className="text-xl font-semibold neuro-text mb-4">Order Status Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 neuro-card">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium">Pending</span>
              </div>
              <span className="font-semibold neuro-text">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 neuro-card">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Completed</span>
              </div>
              <span className="font-semibold neuro-text">{stats.completedOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 neuro-card">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">Total</span>
              </div>
              <span className="font-semibold neuro-text">{stats.totalOrders}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="hybrid-card p-6">
          <h2 className="text-xl font-semibold neuro-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="neuro-button p-4 text-left">
              <ShoppingBag className="h-6 w-6 mb-2" />
              <div className="text-sm font-medium">View Orders</div>
              <div className="text-xs text-gray-600">Manage all orders</div>
            </button>
            <button className="neuro-button p-4 text-left">
              <Package className="h-6 w-6 mb-2" />
              <div className="text-sm font-medium">Menu Items</div>
              <div className="text-xs text-gray-600">Add or edit items</div>
            </button>
            <button className="neuro-button p-4 text-left">
              <Users className="h-6 w-6 mb-2" />
              <div className="text-sm font-medium">Customers</div>
              <div className="text-xs text-gray-600">View customer list</div>
            </button>
            <button className="neuro-button p-4 text-left">
              <Star className="h-6 w-6 mb-2" />
              <div className="text-sm font-medium">Reviews</div>
              <div className="text-xs text-gray-600">Customer feedback</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}