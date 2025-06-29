// src/components/menu/MenuCategory.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { Category } from '@/types/menu';
import { Badge } from '@/components/ui/badge';

interface MenuCategoryProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  itemCounts?: { [categoryId: number]: number };
}

export default function MenuCategory({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  itemCounts = {}
}: MenuCategoryProps) {
  const totalItems = Object.values(itemCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold neuro-text">Categories</h2>
        <Badge variant="outline" className="neuro-card border-none">
          {categories.length} categories
        </Badge>
      </div>

      {/* All Items Button */}
      <button
        onClick={() => onCategorySelect(null)}
        className={`w-full p-4 rounded-glass transition-all duration-300 ${
          selectedCategory === null
            ? 'hybrid-card ring-2 ring-black/20'
            : 'glass-card hover:bg-glass-medium'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="neuro-card p-3 w-12 h-12 flex items-center justify-center">
              <span className="text-xl">🍽️</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold neuro-text">All Items</h3>
              <p className="text-sm text-gray-600">Browse everything</p>
            </div>
          </div>
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"}
            className={selectedCategory === null ? "neuro-button border-none" : "neuro-card border-none"}
          >
            {totalItems}
          </Badge>
        </div>
      </button>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {categories
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((category) => (
          <button
            key={category.categoryId}
            onClick={() => onCategorySelect(category.categoryId)}
            className={`p-4 rounded-glass transition-all duration-300 group ${
              selectedCategory === category.categoryId
                ? 'hybrid-card ring-2 ring-black/20'
                : 'glass-card hover:bg-glass-medium'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Category Icon/Image */}
                <div className="relative w-12 h-12 rounded-neuro overflow-hidden">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.categoryName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="neuro-card w-full h-full flex items-center justify-center">
                      <span className="text-xl">
                        {getCategoryEmoji(category.categoryName)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="text-left flex-1">
                  <h3 className={`font-semibold transition-colors ${
                    selectedCategory === category.categoryId 
                      ? 'neuro-text' 
                      : 'neuro-text group-hover:text-gray-900'
                  }`}>
                    {category.categoryName}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Item Count Badge */}
              <Badge 
                variant={selectedCategory === category.categoryId ? "default" : "outline"}
                className={`${
                  selectedCategory === category.categoryId 
                    ? "neuro-button border-none" 
                    : "neuro-card border-none"
                } group-hover:shadow-neuro-flat transition-all duration-300`}
              >
                {itemCounts[category.categoryId] || 0}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      {/* Category Stats */}
      <div className="glass-card p-4 space-y-3">
        <h4 className="font-medium glass-text">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold glass-text text-lg">
              {categories.filter(c => c.isActive).length}
            </div>
            <div className="glass-text opacity-80">Active Categories</div>
          </div>
          <div className="text-center">
            <div className="font-semibold glass-text text-lg">
              {totalItems}
            </div>
            <div className="glass-text opacity-80">Total Items</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get emoji for category
function getCategoryEmoji(categoryName: string): string {
  const name = categoryName.toLowerCase();
  
  if (name.includes('appetizer') || name.includes('starter')) return '🥗';
  if (name.includes('main') || name.includes('entree')) return '🍖';
  if (name.includes('dessert') || name.includes('sweet')) return '🍰';
  if (name.includes('drink') || name.includes('beverage')) return '🥤';
  if (name.includes('pizza')) return '🍕';
  if (name.includes('burger')) return '🍔';
  if (name.includes('pasta')) return '🍝';
  if (name.includes('salad')) return '🥗';
  if (name.includes('soup')) return '🍲';
  if (name.includes('seafood') || name.includes('fish')) return '🐟';
  if (name.includes('chicken')) return '🍗';
  if (name.includes('beef')) return '🥩';
  if (name.includes('vegetarian') || name.includes('vegan')) return '🥬';
  if (name.includes('sandwich')) return '🥪';
  if (name.includes('taco') || name.includes('mexican')) return '🌮';
  if (name.includes('asian') || name.includes('chinese')) return '🥢';
  if (name.includes('italian')) return '🍕';
  if (name.includes('breakfast')) return '🍳';
  if (name.includes('coffee')) return '☕';
  if (name.includes('ice cream')) return '🍨';
  
  return '🍽️'; // Default
}