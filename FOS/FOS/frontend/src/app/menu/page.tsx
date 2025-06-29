// src/app/orders/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Search,
} from "lucide-react";

// Simplified interfaces
interface Order {
  orderId: number;
  userId: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  totalAmount: number;
  orderDate: string;
  estimatedReadyTime?: string;
  completedAt?: string;
  customerNotes?: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  orderItemId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchQuery]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch orders from Order Service
      const response = await fetch("http://localhost:8082/api/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toString().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerPhone.includes(query)
      );
    }

    // Sort by order date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/orders/${orderId}/status?status=${newStatus}&staffId=1`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders
      await loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "CONFIRMED":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "PREPARING":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "READY":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PREPARING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "READY":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "PENDING":
        return "CONFIRMED";
      case "CONFIRMED":
        return "PREPARING";
      case "PREPARING":
        return "READY";
      case "READY":
        return "COMPLETED";
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case "PENDING":
        return "Confirm Order";
      case "CONFIRMED":
        return "Start Preparing";
      case "PREPARING":
        return "Mark Ready";
      case "READY":
        return "Complete Order";
      default:
        return null;
    }
  };

  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.orderStatus === "PENDING").length,
    CONFIRMED: orders.filter((o) => o.orderStatus === "CONFIRMED").length,
    PREPARING: orders.filter((o) => o.orderStatus === "PREPARING").length,
    READY: orders.filter((o) => o.orderStatus === "READY").length,
    COMPLETED: orders.filter((o) => o.orderStatus === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.orderStatus === "CANCELLED").length,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Order Management
            </h1>
            <p className="text-gray-600">
              Manage incoming orders and track progress
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Orders ({statusCounts.ALL})</option>
                <option value="PENDING">
                  Pending ({statusCounts.PENDING})
                </option>
                <option value="CONFIRMED">
                  Confirmed ({statusCounts.CONFIRMED})
                </option>
                <option value="PREPARING">
                  Preparing ({statusCounts.PREPARING})
                </option>
                <option value="READY">Ready ({statusCounts.READY})</option>
                <option value="COMPLETED">
                  Completed ({statusCounts.COMPLETED})
                </option>
                <option value="CANCELLED">
                  Cancelled ({statusCounts.CANCELLED})
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              status: "PENDING",
              label: "Pending",
              count: statusCounts.PENDING,
              color: "bg-yellow-500",
            },
            {
              status: "CONFIRMED",
              label: "Confirmed",
              count: statusCounts.CONFIRMED,
              color: "bg-blue-500",
            },
            {
              status: "PREPARING",
              label: "Preparing",
              count: statusCounts.PREPARING,
              color: "bg-orange-500",
            },
            {
              status: "READY",
              label: "Ready",
              count: statusCounts.READY,
              color: "bg-green-500",
            },
          ].map((item) => (
            <div
              key={item.status}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setStatusFilter(item.status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {item.count}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <OrdersLoadingSkeleton />
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onStatusUpdate={updateOrderStatus}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                getNextStatus={getNextStatus}
                getNextStatusLabel={getNextStatusLabel}
              />
            ))}
          </div>
        ) : (
          <EmptyState statusFilter={statusFilter} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}

// Order Card Component
interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: number, newStatus: string) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getNextStatus: (status: string) => string | null;
  getNextStatusLabel: (status: string) => string | null;
}

function OrderCard({
  order,
  onStatusUpdate,
  getStatusIcon,
  getStatusColor,
  getNextStatus,
  getNextStatusLabel,
}: OrderCardProps) {
  const nextStatus = getNextStatus(order.orderStatus);
  const nextStatusLabel = getNextStatusLabel(order.orderStatus);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Order #{order.orderId}
            </h3>
            <p className="text-sm text-gray-600">
              {order.customerName} • {order.customerPhone}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {getStatusIcon(order.orderStatus)}
            <span>{order.orderStatus}</span>
          </div>
          <p className="text-lg font-bold text-gray-800 mt-1">
            ${order.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {order.orderItems.map((item) => (
            <div key={item.orderItemId} className="text-sm text-gray-600">
              {item.quantity}x {item.itemName} - ${item.subtotal.toFixed(2)}
              {item.specialInstructions && (
                <p className="text-xs text-gray-500 italic">
                  Note: {item.specialInstructions}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Notes */}
      {order.customerNotes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Customer Notes:
          </h4>
          <p className="text-sm text-gray-600 italic">{order.customerNotes}</p>
        </div>
      )}

      {/* Delivery Info */}
      {order.orderType === "DELIVERY" && order.deliveryAddress && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Delivery Address:
          </h4>
          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Type: {order.orderType.replace("_", " ")}
        </div>

        <div className="flex space-x-2">
          <Link href={`/orders/${order.orderId}`}>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>View</span>
            </button>
          </Link>

          {nextStatus && nextStatusLabel && (
            <button
              onClick={() => onStatusUpdate(order.orderId, nextStatus)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {nextStatusLabel}
            </button>
          )}

          {order.orderStatus === "PENDING" && (
            <button
              onClick={() => onStatusUpdate(order.orderId, "CANCELLED")}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-100 rounded w-48"></div>
              <div className="h-3 bg-gray-100 rounded w-40"></div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-5 bg-gray-100 rounded w-16"></div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-100 rounded w-24"></div>
            <div className="h-3 bg-gray-50 rounded w-full"></div>
            <div className="h-3 bg-gray-50 rounded w-3/4"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-100 rounded w-20"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty State
interface EmptyStateProps {
  statusFilter: string;
  searchQuery: string;
}

function EmptyState({ statusFilter, searchQuery }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
        <span className="text-4xl">📋</span>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No orders found
      </h3>

      <p className="text-gray-600 mb-6">
        {searchQuery
          ? `No orders match your search "${searchQuery}"`
          : statusFilter !== "ALL"
          ? `No orders with status "${statusFilter}"`
          : "No orders have been placed yet"}
      </p>

      <Link href="/menu">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          View Menu
        </button>
      </Link>
    </div>
  );
}
