// src/app/cart/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Trash2, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { cartItems, clearCart, getTotalPrice, getTotalItems, getTotalPreparationTime } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  const estimatedTime = getTotalPreparationTime() + 15; // Add 15 min for delivery

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EmptyCart />
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
            <Link href="/menu">
              <Button variant="ghost" className="neuro-card border-none">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold neuro-text">Your Cart</h1>
              <p className="text-gray-600">
                {getTotalItems()} items • Estimated {estimatedTime} min
              </p>
            </div>
          </div>

          {cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 neuro-card border-none"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="hybrid-card p-6">
              <h2 className="text-xl font-semibold neuro-text mb-6">Order Items</h2>
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={item.itemId}>
                    <CartItem item={item} />
                    {index < cartItems.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add More Items */}
            <div className="glass-card p-4 text-center">
              <p className="glass-text mb-3">Want to add more items?</p>
              <Link href="/menu">
                <Button variant="outline" className="interactive-glass">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Menu
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="checkout-summary">
                <h3 className="text-lg font-semibold neuro-text mb-4">Order Summary</h3>
                
                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="neuro-text">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Delivery Fee
                      {subtotal > 50 && (
                        <span className="text-green-600 ml-1">(Free over $50)</span>
                      )}
                    </span>
                    <span className="neuro-text">
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  
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
                    <p className="glass-text text-sm">Estimated Delivery Time</p>
                    <p className="glass-text font-semibold">{estimatedTime} - {estimatedTime + 10} minutes</p>
                  </div>
                </div>

                {/* Checkout Button */}
                {isAuthenticated ? (
                  <Link href="/checkout">
                    <Button className="w-full neuro-button h-12 text-lg">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login?redirect=/checkout">
                      <Button className="w-full neuro-button h-12 text-lg">
                        Sign In to Checkout
                      </Button>
                    </Link>
                    <Link href="/auth/register?redirect=/checkout">
                      <Button variant="outline" className="w-full neuro-card border-none">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>Have a promo code?</span>
                      <Plus className="h-4 w-4 group-open:rotate-45 transition-transform" />
                    </summary>
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="neuro-input w-full text-sm"
                      />
                      <Button size="sm" className="neuro-button w-full">
                        Apply Code
                      </Button>
                    </div>
                  </details>
                </div>

                {/* Security Notice */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <span>🔒</span>
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Empty Cart Component
function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold neuro-text mb-4">Your cart is empty</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. 
        Start browsing our delicious menu to get started!
      </p>

      <div className="space-y-4">
        <Link href="/menu">
          <Button className="neuro-button px-8 py-3">
            <Plus className="h-5 w-5 mr-2" />
            Browse Menu
          </Button>
        </Link>
        
        <div className="glass-card p-6 max-w-md mx-auto">
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