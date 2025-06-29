// src/components/common/ConfirmDialog.tsx
'use client';
import React from 'react';
import { AlertTriangle, Trash2, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
  icon
}: ConfirmDialogProps) {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'destructive':
        return <Trash2 className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-blue-500" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-none">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="neuro-card p-2 flex items-center justify-center">
              {getIcon()}
            </div>
            <DialogTitle className="glass-text text-lg">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="glass-text opacity-80">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="interactive-glass"
          >
            <X className="h-4 w-4 mr-2" />
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
            className="neuro-button"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Preset confirmation dialogs
export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Item"
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmText="Delete"
      variant="destructive"
      isLoading={isLoading}
    />
  );
}

export function LogoutConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Sign Out"
      description="Are you sure you want to sign out? You'll need to sign in again to access your account."
      confirmText="Sign Out"
      variant="warning"
      isLoading={isLoading}
    />
  );
}

export function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: number;
  isLoading?: boolean;
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Cancel Order"
      description={`Are you sure you want to cancel order #${orderId}? This action cannot be undone and you may not receive a full refund.`}
      confirmText="Cancel Order"
      variant="destructive"
      isLoading={isLoading}
    />
  );
}