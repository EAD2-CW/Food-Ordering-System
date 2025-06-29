// src/app/checkout/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, MapPin, Clock, User, Phone, MessageSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { orderService } from '@/services/orderService';
import { OrderType } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.DELIVERY);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    customerNotes: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    // Redirect if cart is empty
    if (cartItems.length === 0) {
      router.push('/menu');
      return;
    }

    // Pre-fill form with user data
    if (user) {
      setFormData({
        customerName: `${user.firstName} ${user.lastName}`,
        customerPhone: user.phoneNumber || '',
        deliveryAddress: user.address || '',
        customerNotes: '',
      });
    }
  }, [isAuthenticated, cartItems, user, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Invalid phone number format';
    }

    if (orderType === OrderType.DELIVERY && !formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm() || !user) return;

    setIsLoading(true);

    try {
      const orderRequest = {
        userId: user.userId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        deliveryAddress: orderType === OrderType.DELIVERY ? formData.deliveryAddress : undefined,
        customerNotes: formData.customerNotes || undefined,
        orderType: orderType,
        orderItems: cartItems.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || undefined,
        })),
      };

      const order = await orderService.createOrder(orderRequest);
      
      clearCart();
      
      addNotification({
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Order #${order.orderId} has been placed. You'll receive updates soon.`,
        duration: 8000,
      });

      router.push(`/orders/${order.orderId}`);
    } catch (error: any) {
      console.error('Order placement failed:', error);
      addNotification({
        type: 'error',
        title: 'Order Failed',
        message: error.message || 'Failed to place order. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return null; // Will redirect
  }

  const subtotal = getTotalPrice();
  const deliveryFee = orderType === OrderType.DELIVERY && subtotal < 50 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="neuro-card border-none">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold neuro-text">Checkout</h1>
            <p className="text-gray-600">{getTotalItems()} items • {formatPrice(total)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type Selection */}
            <div className="hybrid-card p-6">
              <h2 className="text-xl font-semibold neuro-text mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Order Type
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(OrderType).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`p-4 rounded-glass text-center transition-all duration-300 ${
                      orderType === type
                        ? 'hybrid-card ring-2 ring-black/20'
                        : 'glass-card hover:bg-glass-medium'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {type === OrderType.DELIVERY && '🚚'}
                      {type === OrderType.TAKEAWAY && '🥡'}
                      {type === OrderType.DINE_IN && '🍽️'}
                    </div>
                    <div className={`font-medium ${orderType === type ? 'neuro-text' : 'glass-text'}`}>
                      {type.replace('_', ' ')}
                    </div>
                    <div className={`text-xs ${orderType === type ? 'text-gray-600' : 'glass-text opacity-80'}`}>
                      {type === OrderType.DELIVERY && 'Door delivery'}
                      {type === OrderType.TAKEAWAY && 'Pick up in store'}
                      {type === OrderType.DINE_IN && 'Eat at restaurant'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="hybrid-card p-6">
              <h2 className="text-xl font-semibold neuro-text mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName" className="neuro-text">Full Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className={`neuro-input ${errors.customerName ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerPhone" className="neuro-text">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className={`neuro-input ${errors.customerPhone ? 'border-red-500' : ''}`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address (only for delivery) */}
            {orderType === OrderType.DELIVERY && (
              <div className="hybrid-card p-6">
                <h2 className="text-xl font-semibold neuro-text mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Address
                </h2>
                <div>
                  <Label htmlFor="deliveryAddress" className="neuro-text">Full Address</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    className={`neuro-input ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Please include apartment/unit number, street name, and any landmarks
                  </p>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="hybrid-card p-6">
              <h2 className="text-xl font-semibold neuro-text mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Special Instructions
              </h2>
              <div>
                <Label htmlFor="customerNotes" className="neuro-text">Order Notes (Optional)</Label>
                <Textarea
                  id="customerNotes"
                  value={formData.customerNotes}
                  onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                  className="neuro-input"
                  placeholder="Any special requests or instructions for your order..."
                  rows={3}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {200 - formData.customerNotes.length} characters remaining
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="hybrid-card p-6">
              <h2 className="text-xl font-semibold neuro-text mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h2>
              <div className="glass-card p-4 text-center">
                <p className="glass-text mb-2">💳 Cash on Delivery</p>
                <p className="glass-text text-sm opacity-80">
                  Pay with cash when your order arrives. Card payment coming soon!
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Items */}
              <div className="checkout-summary">
                <h3 className="text-lg font-semibold neuro-text mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.itemId} item={item} showControls={false} compact />
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="checkout-summary">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="neuro-text">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {orderType === OrderType.DELIVERY && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Delivery Fee
                        {subtotal >= 50 && (
                          <span className="text-green-600 ml-1">(Free over $50)</span>
                        )}
                      </span>
                      <span className="neuro-text">
                        {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="neuro-text">{formatPrice(tax)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="neuro-text">Total</span>
                    <span className="neuro-text">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="glass-card p-3 mb-6">
                  <div className="text-center">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-white/70" />
                    <p className="glass-text text-sm">Estimated Time</p>
                    <p className="glass-text font-semibold">
                      {orderType === OrderType.DELIVERY ? '45-60' : '20-30'} minutes
                    </p>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full neuro-button h-12 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 border-t-transparent"></div>
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    `Place Order • ${formatPrice(total)}`
                  )}
                </Button>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our{' '}
                  <Link href="/terms" className="underline hover:no-underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}