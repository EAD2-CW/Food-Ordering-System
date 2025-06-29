'use client';
import React from 'react';
import Layout from '@/components/layout/Layout';
import OrderManagement from '@/components/admin/OrderManagement';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <OrderManagement />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}