// src/app/admin/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  ClipboardList,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  BarChart3,
  RefreshCw,
  Calendar,
  Clock,
  Package,
} from "lucide-react";

// Interfaces for dashboard data
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalMenuItems: number;
  totalCategories: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  activeMenuItems: number;
  recentUsers: number;
}

interface RecentOrder {
  orderId: number;
  customerName: string;
  orderStatus: string;
  totalAmount: number;
  orderDate: string;
}

interface RecentUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalMenuItems: 0,
    totalCategories: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    activeMenuItems: 0,
    recentUsers: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch data from all microservices
      const [usersRes, ordersRes, menuItemsRes, categoriesRes] =
        await Promise.all([
          fetch("http://localhost:8083/api/users").catch(() => ({
            json: () => [],
          })),
          fetch("http://localhost:8082/api/orders").catch(() => ({
            json: () => [],
          })),
          fetch("http://localhost:8081/api/items").catch(() => ({
            json: () => [],
          })),
          fetch("http://localhost:8081/api/categories").catch(() => ({
            json: () => [],
          })),
        ]);

      const [users, orders, menuItems, categories] = await Promise.all([
        usersRes.json?.() || [],
        ordersRes.json?.() || [],
        menuItemsRes.json?.() || [],
        categoriesRes.json?.() || [],
      ]);

      // Calculate statistics
      const today = new Date().toISOString().split("T")[0];
      const todayOrders = orders.filter((order: any) =>
        order.orderDate?.startsWith(today)
      );

      const pendingOrders = orders.filter(
        (order: any) => order.orderStatus === "PENDING"
      );

      const completedOrders = orders.filter(
        (order: any) => order.orderStatus === "COMPLETED"
      );

      const totalRevenue = completedOrders.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
        0
      );

      const activeMenuItems = menuItems.filter((item: any) => item.isAvailable);

      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const recentUsers = users.filter(
        (user: any) => new Date(user.createdAt || user.created_at) > last7Days
      );

      // Update stats
      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalMenuItems: menuItems.length,
        totalCategories: categories.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        totalRevenue: totalRevenue,
        todayOrders: todayOrders.length,
        activeMenuItems: activeMenuItems.length,
        recentUsers: recentUsers.length,
      });

      // Set recent orders (last 5)
      const sortedOrders = orders
        .sort(
          (a: any, b: any) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
        .slice(0, 5);
      setRecentOrders(sortedOrders);

      // Set recent users (last 5)
      const sortedUsers = users
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt || b.created_at).getTime() -
            new Date(a.createdAt || a.created_at).getTime()
        )
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-orange-100 text-orange-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">System overview and management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={fetchDashboardData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalUsers}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +{stats.recentUsers} this week
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.todayOrders} today
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.completedOrders} completed orders
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.pendingOrders}
                </p>
                <p className="text-xs text-gray-500 mt-1">Requires attention</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalMenuItems}
                </p>
                <p className="text-xs text-gray-500">
                  {stats.activeMenuItems} active
                </p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalCategories}
                </p>
                <p className="text-xs text-gray-500">Food categories</p>
              </div>
              <ClipboardList className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Orders
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.todayOrders}
                </p>
                <p className="text-xs text-gray-500">Orders placed today</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/users" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    User Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage customers and staff
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/menu" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Menu Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage menu items and categories
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order Analytics
                  </h3>
                  <p className="text-gray-600 text-sm">
                    View order reports and trends
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/categories" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <ClipboardList className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Category Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Organize menu categories
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/reports" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Sales Reports
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Revenue and performance analytics
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/settings" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    System Settings
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Configure application settings
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Orders
              </h3>
              <Link
                href="/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Order #{order.orderId}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                      <p className="text-sm font-bold text-gray-800 mt-1">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent orders</p>
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Users
              </h3>
              <Link
                href="/admin/users"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800"
                            : user.role === "STAFF"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent users</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
