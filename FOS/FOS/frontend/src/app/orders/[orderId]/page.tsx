// src/app/orders/[orderId]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Download, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import OrderTracking from '@/components/order/OrderTracking';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = parseInt(params.orderId as string);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isNaN(orderId)) {
      setError('Invalid order ID');
      setIsLoading(false);
      return;
    }

    loadOrder();
  }, [orderId, isAuthenticated, router]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const orderData = await orderService.getOrder(orderId);
      
      // Check if user owns this order
      if (user && orderData.userId !== user.userId) {
        setError('You are not authorized to view this order');
        return;
      }
      
      setOrder(orderData);
    } catch (error: any) {
      console.error('Failed to load order:', error);
      setError(error.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order #${orderId} - FoodOrder`,
          text: `Track my food order #${orderId}`,
          url: url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        addNotification({
          type: 'success',
          title: 'Link Copied',
          message: 'Order link copied to clipboard',
          duration: 3000,
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Failed to Copy',
          message: 'Unable to copy link to clipboard',
        });
      }
    }
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement PDF receipt generation
    addNotification({
      type: 'info',
      title: 'Coming Soon',
      message: 'Receipt download feature will be available soon',
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <OrderDetailSkeleton />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold neuro-text mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-x-4">
              <Link href="/orders">
                <Button className="neuro-button">
                  View All Orders
                </Button>
              </Link>
              <Button variant="outline" onClick={loadOrder} className="neuro-card border-none">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
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
          <div className="flex items-center space-x-4">
            <Link href="/orders">
              <Button variant="ghost" className="neuro-card border-none">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold neuro-text">Order Details</h1>
              <p className="text-gray-600">Track your order progress</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="neuro-card border-none"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="neuro-card border-none"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Receipt
            </Button>
            <Button
              variant="outline"
              onClick={loadOrder}
              className="neuro-card border-none"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Order Tracking */}
        {order && (
          <OrderTracking orderId={orderId} initialOrder={order} />
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/menu" className="block">
            <div className="glass-card p-6 text-center hover:bg-glass-medium transition-colors duration-300">
              <div className="neuro-card p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl">🍽️</span>
              </div>
              <h3 className="font-semibold glass-text mb-1">Order Again</h3>
              <p className="text-sm glass-text opacity-80">Browse our menu</p>
            </div>
          </Link>

          <Link href="/orders" className="block">
            <div className="glass-card p-6 text-center hover:bg-glass-medium transition-colors duration-300">
              <div className="neuro-card p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <h3 className="font-semibold glass-text mb-1">Order History</h3>
              <p className="text-sm glass-text opacity-80">View past orders</p>
            </div>
          </Link>

          <div className="glass-card p-6 text-center cursor-pointer hover:bg-glass-medium transition-colors duration-300">
            <div className="neuro-card p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
            <h3 className="font-semibold glass-text mb-1">Contact Support</h3>
            <p className="text-sm glass-text opacity-80">Get help</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Loading skeleton component
function OrderDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Order Status Skeleton */}
      <div className="hybrid-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-16 w-full" />
      </div>

      {/* Progress Skeleton */}
      <div className="hybrid-card p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="hybrid-card p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}