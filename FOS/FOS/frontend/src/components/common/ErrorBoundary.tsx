// src/components/common/ErrorBoundary.tsx
'use client';
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold neuro-text mb-4">Something went wrong</h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-6 p-4 bg-red-50 rounded-glass border border-red-200">
            <summary className="font-medium text-red-800 cursor-pointer mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.message}
              {error.stack && (
                <>
                  {'\n\nStack Trace:\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        <div className="space-y-3">
          <Button onClick={reset} className="w-full neuro-button">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full neuro-card border-none"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

// Specific error boundary components
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div className="container mx-auto px-4 py-16">
          <DefaultErrorFallback error={error} reset={reset} />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: React.ReactNode; 
  componentName?: string;
}) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div className="p-4 border border-red-200 rounded-glass bg-red-50">
          <div className="flex items-center space-x-2 text-red-800 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">
              {componentName ? `${componentName} Error` : 'Component Error'}
            </span>
          </div>
          <p className="text-red-600 text-sm mb-3">
            This component failed to load properly.
          </p>
          <Button size="sm" onClick={reset} variant="outline" className="text-red-700 border-red-300">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}