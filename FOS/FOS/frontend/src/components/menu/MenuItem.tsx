// src/components/menu/MenuItem.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Clock, Users, Heart, Star } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MenuItemProps {
  item: MenuItemType;
  onViewDetails?: (item: MenuItemType) => void;
}

export default function MenuItem({ item, onViewDetails }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const handleAddToCart = () => {
    addToCart(item, quantity, specialInstructions);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${item.itemName} has been added to your cart`,
      duration: 3000
    });
    setQuantity(1);
    setSpecialInstructions('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getDietaryBadges = () => {
    if (!item.dietaryInfo) return [];
    return item.dietaryInfo.split(',').map(info => info.trim());
  };

  return (
    <div className="menu-item-card group">
      {/* Image Section */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-glass">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.itemName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full neuro-card flex items-center justify-center">
            <div className="text-4xl">🍽️</div>
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`interactive-glass p-2 rounded-full ${
                isFavorite ? 'text-red-400' : 'text-white/70'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Unavailable
              </Badge>
            </div>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="glass-card px-3 py-1">
            <span className="text-lg font-bold glass-text">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-3">
        {/* Title and Rating */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold neuro-text line-clamp-2 flex-1">
            {item.itemName}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {item.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {item.preparationTime && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{item.preparationTime} min</span>
            </div>
          )}
          {item.calories && (
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{item.calories} cal</span>
            </div>
          )}
        </div>

        {/* Dietary Information */}
        {getDietaryBadges().length > 0 && (
          <div className="flex flex-wrap gap-1">
            {getDietaryBadges().slice(0, 3).map((dietary, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs neuro-card border-none"
              >
                {dietary}
              </Badge>
            ))}
            {getDietaryBadges().length > 3 && (
              <Badge variant="outline" className="text-xs neuro-card border-none">
                +{getDietaryBadges().length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        {item.isAvailable && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium neuro-text">Quantity:</span>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="neuro-card w-8 h-8 p-0"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="neuro-card w-8 h-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Special instructions (optional)"
                className="neuro-input w-full text-sm h-16 resize-none"
                maxLength={100}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {item.isAvailable ? (
            <>
              <Button
                onClick={handleAddToCart}
                className="flex-1 neuro-button"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
              {onViewDetails && (
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(item)}
                  className="neuro-card border-none"
                  size="sm"
                >
                  Details
                </Button>
              )}
            </>
          ) : (
            <Button disabled className="flex-1" size="sm">
              Currently Unavailable
            </Button>
          )}
        </div>

        {/* Total Price Preview */}
        {item.isAvailable && quantity > 1 && (
          <div className="glass-card p-2 text-center">
            <span className="text-sm glass-text">
              Total: {formatPrice(item.price * quantity)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}