import { OrderCardProps, OrderStatus } from "../types";

export default function OrderCard({
  order,
  isAdmin = false,
  onStatusUpdate,
}: OrderCardProps) {
  const getStatusClass = (status: OrderStatus): string => {
    const statusClasses: Record<OrderStatus, string> = {
      PENDING:
        "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium",
      ACCEPTED:
        "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium",
      PREPARING:
        "bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium",
      READY:
        "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium",
      DELIVERED:
        "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium",
      REJECTED:
        "bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium",
    };
    return (
      statusClasses[status] ||
      "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
    );
  };

  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    const statusFlow: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ["ACCEPTED", "REJECTED"],
      ACCEPTED: ["PREPARING"],
      PREPARING: ["READY"],
      READY: ["DELIVERED"],
      DELIVERED: [],
      REJECTED: [],
    };
    return statusFlow[currentStatus] || [];
  };

  const getStatusIcon = (status: OrderStatus): string => {
    const statusIcons: Record<OrderStatus, string> = {
      PENDING: "⏳",
      ACCEPTED: "✅",
      PREPARING: "👨‍🍳",
      READY: "📦",
      DELIVERED: "🚚",
      REJECTED: "❌",
    };
    return statusIcons[status] || "📋";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = (status: OrderStatus): void => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, status);
    }
  };

  const getButtonClass = (status: OrderStatus): string => {
    const buttonClasses: Record<OrderStatus, string> = {
      ACCEPTED:
        "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors",
      PREPARING:
        "bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors",
      READY:
        "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors",
      DELIVERED:
        "bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors",
      REJECTED:
        "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors",
      PENDING:
        "bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors",
    };
    return (
      buttonClasses[status] ||
      "bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
    );
  };

  const getEstimatedTime = (status: OrderStatus): string => {
    const estimatedTimes: Record<OrderStatus, string> = {
      PENDING: "Awaiting confirmation",
      ACCEPTED: "20-30 minutes",
      PREPARING: "15-25 minutes",
      READY: "Ready for pickup/delivery",
      DELIVERED: "Completed",
      REJECTED: "Order cancelled",
    };
    return estimatedTimes[status] || "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id}
            </h3>
            <span className={getStatusClass(order.status)}>
              {getStatusIcon(order.status)} {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">
            Ordered on {formatDate(order.orderDate)}
          </p>
          <p className="text-sm text-blue-600 font-medium">
            {getEstimatedTime(order.status)}
          </p>
          {isAdmin && order.user && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Customer:</strong> {order.user.username}
              </p>
              {order.user.email && (
                <p className="text-sm text-blue-700">
                  <strong>Email:</strong> {order.user.email}
                </p>
              )}
              {order.user.phone && (
                <p className="text-sm text-blue-700">
                  <strong>Phone:</strong> {order.user.phone}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items:</h4>
        <div className="space-y-3">
          {order.orderItems?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  {item.menuItem?.name || `Item #${item.menuItemId}`}
                </span>
                {item.menuItem?.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.menuItem.description}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Information */}
      {order.deliveryAddress && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            Delivery Address:
          </h4>
          <p className="text-sm text-green-700">{order.deliveryAddress}</p>
        </div>
      )}

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Total Amount:
          </span>
          <span className="text-2xl font-bold text-green-600">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
          <span>Items ({order.orderItems?.length || 0}):</span>
          <span>
            $
            {order.orderItems
              ?.reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </span>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin &&
        onStatusUpdate &&
        getNextStatuses(order.status).length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Update Order Status:
            </h4>
            <div className="flex flex-wrap gap-2">
              {getNextStatuses(order.status).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className={getButtonClass(status)}
                  title={`Mark order as ${status.toLowerCase()}`}
                >
                  {getStatusIcon(status)} Mark as {status.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Status Complete Message */}
      {(order.status === "DELIVERED" || order.status === "REJECTED") &&
        !isAdmin && (
          <div
            className={`p-3 rounded-lg ${
              order.status === "DELIVERED"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                order.status === "DELIVERED" ? "text-green-800" : "text-red-800"
              }`}
            >
              {order.status === "DELIVERED"
                ? "🎉 Order delivered successfully! Thank you for your order."
                : "😔 This order was cancelled. Please contact support if you have questions."}
            </p>
          </div>
        )}
    </div>
  );
}
