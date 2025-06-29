// src/components/common/SearchInput.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'glass' | 'neuro' | 'default';
  debounceMs?: number;
  showRecentSearches?: boolean;
  recentSearches?: string[];
  onRecentSearchClick?: (search: string) => void;
  onClearRecent?: () => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function SearchInput({
  value = '',
  onSearch,
  placeholder = 'Search...',
  className,
  variant = 'default',
  debounceMs = 300,
  showRecentSearches = false,
  recentSearches = [],
  onRecentSearchClick,
  onClearRecent,
  suggestions = [],
  onSuggestionClick,
  loading = false,
  disabled = false
}: SearchInputProps) {
  const [query, setQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== value) {
        onSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, onSearch, value]);

  // Update local state when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (showRecentSearches || suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow clicks on dropdown items
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    onSearch(search);
    setShowDropdown(false);
    if (onRecentSearchClick) {
      onRecentSearchClick(search);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowDropdown(false);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const getInputClassName = () => {
    const baseClasses = 'pl-10 pr-10';
    
    switch (variant) {
      case 'glass':
        return cn('glass-input', baseClasses);
      case 'neuro':
        return cn('neuro-input', baseClasses);
      default:
        return cn('', baseClasses);
    }
  };

  const hasDropdownContent = 
    (showRecentSearches && recentSearches.length > 0) || 
    (suggestions.length > 0 && query.length > 0);

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={cn(getInputClassName(), className)}
          disabled={disabled}
        />
        
        {/* Clear button or loading spinner */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600" />
          ) : query ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-auto p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && hasDropdownContent && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute top-full left-0 right-0 z-50 mt-1 py-2 max-h-64 overflow-y-auto',
            variant === 'glass' ? 'glass-card' : 'neuro-card border border-gray-200'
          )}
        >
          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  'text-xs font-medium',
                  variant === 'glass' ? 'glass-text' : 'text-gray-500'
                )}>
                  Recent Searches
                </span>
                {onClearRecent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearRecent}
                    className="h-auto p-0 text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </Button>
                )}
              </div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className={cn(
                    'w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 flex items-center space-x-2',
                    variant === 'glass' && 'hover:bg-white/20'
                  )}
                >
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className={variant === 'glass' ? 'glass-text' : 'text-gray-700'}>
                    {search}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          {showRecentSearches && recentSearches.length > 0 && suggestions.length > 0 && query.length > 0 && (
            <div className="border-t border-gray-200 my-2" />
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && query.length > 0 && (
            <div className="px-3 py-2">
              <span className={cn(
                'text-xs font-medium mb-2 block',
                variant === 'glass' ? 'glass-text' : 'text-gray-500'
              )}>
                Suggestions
              </span>
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    'w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 flex items-center space-x-2',
                    variant === 'glass' && 'hover:bg-white/20'
                  )}
                >
                  <Search className="h-3 w-3 text-gray-400" />
                  <span className={variant === 'glass' ? 'glass-text' : 'text-gray-700'}>
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {query.length > 0 && suggestions.length === 0 && (
            <div className="px-3 py-4 text-center">
              <span className={cn(
                'text-sm',
                variant === 'glass' ? 'glass-text opacity-70' : 'text-gray-500'
              )}>
                No suggestions found
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}