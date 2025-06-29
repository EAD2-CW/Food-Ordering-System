import Link from 'next/link';
import { Shield, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <Shield className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold neuro-text mb-4">Access Denied</h1>
        
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. 
          Please contact an administrator if you believe this is an error.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full neuro-button">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              window.location.href = '/auth/login';
            }}
            className="w-full neuro-card border-none"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}