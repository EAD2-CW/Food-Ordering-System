// src/components/cart/CartItem.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Trash2, Edit3 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItemProps {
  item: CartItemType;
  showControls?: boolean;
  compact?: boolean;
}

export default function CartItem({ item, showControls = true, compact = false }: CartItemProps) {
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [tempInstructions, setTempInstructions] = useState(item.specialInstructions || '');
  const { updateQuantity, removeFromCart, updateInstructions } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.itemId);
    } else {
      updateQuantity(item.itemId, newQuantity);
    }
  };

  const handleSaveInstructions = () => {
    updateInstructions(item.itemId, tempInstructions);
    setIsEditingInstructions(false);
  };

  const handleCancelEdit = () => {
    setTempInstructions(item.specialInstructions || '');
    setIsEditingInstructions(false);
  };

  const subtotal = item.price * item.quantity;

  if (compact) {
    return (
      <div className="glass-card p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative w-12 h-12 rounded-neuro overflow-hidden">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.itemName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="neuro-card w-full h-full flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium glass-text truncate">{item.itemName}</h4>
            <p className="text-sm glass-text opacity-80">
              {item.quantity} × {formatPrice(item.price)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold glass-text">{formatPrice(subtotal)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-item">
      <div className="flex items-start space-x-4">
        {/* Item Image */}
        <div className="relative w-20 h-20 rounded-glass overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.itemName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="neuro-card w-full h-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold neuro-text">{item.itemName}</h3>
              <p className="text-gray-600 text-sm">{formatPrice(item.price)} each</p>
              
              {/* Preparation Time */}
              {item.preparationTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Prep time: ~{item.preparationTime} min
                </p>
              )}
            </div>

            {/* Remove Button */}
            {showControls && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromCart(item.itemId)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Special Instructions */}
          <div className="mt-3">
            {isEditingInstructions ? (
              <div className="space-y-2">
                <Input
                  value={tempInstructions}
                  onChange={(e) => setTempInstructions(e.target.value)}
                  placeholder="Special instructions..."
                  className="neuro-input text-sm"
                  maxLength={100}
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveInstructions} className="neuro-button text-xs">
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit} className="neuro-card border-none text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {item.specialInstructions ? (
                    <p className="text-sm text-gray-600 italic">
                      "{item.specialInstructions}"
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">No special instructions</p>
                  )}
                </div>
                {showControls && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingInstructions(true)}
                    className="text-gray-500 hover:text-gray-700 p-1 ml-2"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Quantity Controls and Subtotal */}
          {showControls && (
            <div className="flex items-center justify-between mt-4">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium neuro-text">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="neuro-card w-8 h-8 p-0 border-none"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="w-8 text-center font-medium text-sm">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="neuro-card w-8 h-8 p-0 border-none"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <div className="font-semibold neuro-text text-lg">
                  {formatPrice(subtotal)}
                </div>
                {item.quantity > 1 && (
                  <div className="text-xs text-gray-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}