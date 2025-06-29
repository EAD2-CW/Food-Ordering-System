import Link from 'next/link';
import { Home, Search, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <span className="text-6xl">🍽️</span>
        </div>
        
        <h1 className="text-4xl font-bold neuro-text mb-2">404</h1>
        <h2 className="text-xl font-semibold neuro-text mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full neuro-button">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link href="/menu">
            <Button variant="outline" className="w-full neuro-card border-none">
              <ChefHat className="h-4 w-4 mr-2" />
              Browse Menu
            </Button>
          </Link>
        </div>

        <div className="glass-card p-6 mt-8">
          <h3 className="font-semibold glass-text mb-3">Popular Pages</h3>
          <div className="grid grid-cols-1 gap-2">
            <Link href="/menu">
              <Button variant="outline" size="sm" className="interactive-glass w-full justify-start">
                🍕 Menu
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" size="sm" className="interactive-glass w-full justify-start">
                📦 My Orders
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="interactive-glass w-full justify-start">
                👤 Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}