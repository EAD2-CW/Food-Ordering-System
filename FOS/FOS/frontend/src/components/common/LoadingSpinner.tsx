// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'glass' | 'neuro' | 'simple';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'glass',
  text,
  className,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
    xl: 'border-4'
  };

  const spinner = (
    <div className={cn(
      'animate-spin rounded-full',
      sizeClasses[size],
      borderClasses[size],
      variant === 'glass' && 'border-white/20 border-t-white/80',
      variant === 'neuro' && 'border-gray-300 border-t-gray-700',
      variant === 'simple' && 'border-gray-200 border-t-gray-900',
      className
    )} />
  );

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-3',
      fullScreen ? 'min-h-screen' : 'p-8'
    )}>
      {variant === 'glass' && (
        <div className="glass-card p-6 flex flex-col items-center space-y-3">
          {spinner}
          {text && (
            <p className={cn('glass-text text-center', textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      )}
      
      {variant === 'neuro' && (
        <div className="neuro-card p-6 flex flex-col items-center space-y-3">
          {spinner}
          {text && (
            <p className={cn('neuro-text text-center', textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      )}
      
      {variant === 'simple' && (
        <div className="flex flex-col items-center space-y-3">
          {spinner}
          {text && (
            <p className={cn('text-gray-600 text-center', textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

// Preset loading components
export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return <LoadingSpinner size="lg" variant="glass" text={text} fullScreen />;
}

export function ComponentLoading({ text }: { text?: string }) {
  return <LoadingSpinner size="md" variant="neuro" text={text} />;
}

export function ButtonLoading() {
  return <LoadingSpinner size="sm" variant="simple" className="mr-2" />;
}

export function InlineLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <LoadingSpinner size="sm" variant="simple" />
      <span className="text-sm">{text}</span>
    </div>
  );
}