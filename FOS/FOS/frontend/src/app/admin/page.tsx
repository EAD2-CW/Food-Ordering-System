"use client";
import React from "react";
import Layout from "@/components/layout/Layout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types/auth";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <AdminDashboard />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
