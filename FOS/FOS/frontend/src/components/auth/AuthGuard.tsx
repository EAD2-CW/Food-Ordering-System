// src/components/auth/AuthGuard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: UserRole;
  showFallback?: boolean;
}

export default function AuthGuard({ 
  children, 
  fallback, 
  requiredRole, 
  showFallback = true 
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="glass-card p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80 mx-auto mb-3"></div>
          <p className="glass-text text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    
    if (!showFallback) return null;

    return (
      <div className="text-center py-16">
        <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <Lock className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold neuro-text mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You need to sign in to access this content
        </p>
        <div className="space-x-4">
          <Link href="/auth/login">
            <Button className="neuro-button">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" className="neuro-card border-none">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check role permissions
  if (requiredRole) {
    const roleHierarchy = {
      [UserRole.CUSTOMER]: 0,
      [UserRole.STAFF]: 1,
      [UserRole.ADMIN]: 2,
    };

    const userRoleLevel = roleHierarchy[user?.role || UserRole.CUSTOMER];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      if (fallback) return <>{fallback}</>;
      
      if (!showFallback) return null;

      return (
        <div className="text-center py-16">
          <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <Shield className="h-16 w-16 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold neuro-text mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You don't have permission to access this content. 
            {requiredRole} access required.
          </p>
          <div className="space-x-4">
            <Link href="/">
              <Button className="neuro-button">
                Go Home
              </Button>
            </Link>
            <Button variant="outline" className="neuro-card border-none">
              Contact Support
            </Button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// Quick wrapper components for common use cases
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requiredRole={UserRole.ADMIN} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function StaffOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requiredRole={UserRole.STAFF} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function AuthenticatedOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard fallback={fallback}>
      {children}
    </AuthGuard>
  );
}