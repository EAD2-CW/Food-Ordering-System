// src/components/menu/MenuSearch.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal, DollarSign, Clock } from 'lucide-react';
import { MenuSearchFilters } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MenuSearchProps {
  onFiltersChange: (filters: MenuSearchFilters) => void;
  totalResults: number;
  isLoading?: boolean;
}

export default function MenuSearch({ onFiltersChange, totalResults, isLoading = false }: MenuSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MenuSearchFilters>({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof MenuSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      search: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setShowFilters(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.isAvailable !== undefined) count++;
    if (filters.dietaryInfo && filters.dietaryInfo.length > 0) count++;
    if (filters.sortBy !== 'name' || filters.sortOrder !== 'asc') count++;
    return count;
  };

  const dietaryOptions = [
    'Vegetarian',
    'Vegan', 
    'Gluten-free',
    'Dairy-free',
    'Nut-free',
    'Low-carb',
    'High-protein',
    'Spicy',
    'Halal',
    'Kosher'
  ];

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="hybrid-card p-4">
        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for dishes, ingredients, or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neuro-input pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`neuro-card border-none relative ${showFilters ? 'shadow-neuro-pressed' : ''}`}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {isLoading ? 'Searching...' : `${totalResults} items found`}
          </span>
          
          {/* Quick Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc'];
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
            >
              <SelectTrigger className="neuro-card border-none w-auto min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="preparation-asc">Fastest First</SelectItem>
                <SelectItem value="calories-asc">Lowest Calories</SelectItem>
                <SelectItem value="calories-desc">Highest Calories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="glass-card p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold glass-text">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium glass-text flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Price Range
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="glass-input text-white placeholder:text-white/60"
                  min="0"
                  step="0.01"
                />
                <span className="glass-text">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="glass-input text-white placeholder:text-white/60"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-3">
              <label className="text-sm font-medium glass-text">Availability</label>
              <Select
                value={filters.isAvailable?.toString() || 'all'}
                onValueChange={(value) => 
                  handleFilterChange('isAvailable', value === 'all' ? undefined : value === 'true')
                }
              >
                <SelectTrigger className="glass-input text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="true">Available Only</SelectItem>
                  <SelectItem value="false">Unavailable Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preparation Time */}
            <div className="space-y-3">
              <label className="text-sm font-medium glass-text flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Max Prep Time (min)
              </label>
              <Input
                type="number"
                placeholder="e.g., 30"
                className="glass-input text-white placeholder:text-white/60"
                min="0"
                step="5"
              />
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <label className="text-sm font-medium glass-text">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => {
                const isSelected = filters.dietaryInfo?.includes(option) || false;
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const current = filters.dietaryInfo || [];
                      const updated = isSelected
                        ? current.filter(item => item !== option)
                        : [...current, option];
                      handleFilterChange('dietaryInfo', updated.length > 0 ? updated : undefined);
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      isSelected
                        ? 'neuro-button text-gray-700'
                        : 'glass-card glass-text hover:bg-glass-medium'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-white/70 hover:text-white"
            >
              Clear All Filters
            </Button>
            <Button
              onClick={() => setShowFilters(false)}
              className="neuro-button"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="glass-card border-none">
              Search: {filters.search}
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleFilterChange('search', '');
                }}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.minPrice !== undefined && (
            <Badge variant="outline" className="glass-card border-none">
              Min: ${filters.minPrice}
              <button
                onClick={() => handleFilterChange('minPrice', undefined)}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.maxPrice !== undefined && (
            <Badge variant="outline" className="glass-card border-none">
              Max: ${filters.maxPrice}
              <button
                onClick={() => handleFilterChange('maxPrice', undefined)}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.dietaryInfo?.map((dietary) => (
            <Badge key={dietary} variant="outline" className="glass-card border-none">
              {dietary}
              <button
                onClick={() => {
                  const updated = filters.dietaryInfo?.filter(item => item !== dietary);
                  handleFilterChange('dietaryInfo', updated?.length ? updated : undefined);
                }}
                className="ml-1 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}