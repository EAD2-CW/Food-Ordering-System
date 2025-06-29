// src/components/auth/ProtectedRoute.tsx
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackUrl?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackUrl = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`${fallbackUrl}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Check role hierarchy: ADMIN > STAFF > CUSTOMER
      const roleHierarchy = {
        [UserRole.CUSTOMER]: 0,
        [UserRole.STAFF]: 1,
        [UserRole.ADMIN]: 2,
      };

      const userRoleLevel = roleHierarchy[user?.role || UserRole.CUSTOMER];
      const requiredRoleLevel = roleHierarchy[requiredRole];

      if (userRoleLevel < requiredRoleLevel) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/80 mx-auto mb-4"></div>
          <p className="glass-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (requiredRole && user?.role !== requiredRole) {
    const roleHierarchy = {
      [UserRole.CUSTOMER]: 0,
      [UserRole.STAFF]: 1,
      [UserRole.ADMIN]: 2,
    };

    const userRoleLevel = roleHierarchy[user?.role || UserRole.CUSTOMER];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return null; // Will redirect
    }
  }

  return <>{children}</>;
}