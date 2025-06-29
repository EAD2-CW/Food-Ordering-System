// src/components/layout/Layout.tsx
'use client';
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNotification } from '@/context/NotificationContext';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const { notifications, removeNotification } = useNotification();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-400/30 bg-green-100/20';
      case 'error':
        return 'border-red-400/30 bg-red-100/20';
      case 'warning':
        return 'border-yellow-400/30 bg-yellow-100/20';
      case 'info':
        return 'border-blue-400/30 bg-blue-100/20';
      default:
        return 'border-blue-400/30 bg-blue-100/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Notification Toast Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`glass-card p-4 ${getNotificationStyles(notification.type)} animate-in slide-in-from-right duration-300`}
          >
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium glass-text">
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="mt-1 text-sm glass-text opacity-80">
                    {notification.message}
                  </p>
                )}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-sm glass-text underline hover:no-underline"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="interactive-glass p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 glass-card rounded-full floating-element opacity-30"></div>
        <div className="absolute top-40 right-20 w-24 h-24 glass-card rounded-full floating-element opacity-20" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 glass-card rounded-full floating-element opacity-25" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 glass-card rounded-full floating-element opacity-15" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Additional geometric shapes */}
        <div className="absolute top-1/3 left-1/2 w-16 h-16 glass-card rotate-45 floating-element opacity-20" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 right-10 w-12 h-12 glass-card rotate-12 floating-element opacity-30" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}