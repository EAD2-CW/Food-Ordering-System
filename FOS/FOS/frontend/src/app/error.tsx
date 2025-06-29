'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold neuro-text mb-4">Something went wrong!</h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>

        {process.env.NODE_ENV === 'development' && (
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
