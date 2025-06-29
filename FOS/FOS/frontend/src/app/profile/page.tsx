// src/app/profile/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Save, Edit3, Lock, History, Settings } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuth();
  const { addNotification } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
    }
  }, [isAuthenticated, user, router]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setIsLoading(true);

    try {
      const updatedUser = await authService.updateProfile(user.userId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
      });

      // Update auth context
      login(updatedUser);
      
      setIsEditing(false);
      
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Profile update failed:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold neuro-text">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="hybrid-card p-6 text-center">
              {/* Avatar */}
              <div className="neuro-card p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-700" />
              </div>
              
              {/* User Info */}
              <h2 className="text-xl font-semibold neuro-text mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              <p className="text-sm text-gray-500 mb-4">
                Member since {user ? new Date(user.createdAt).toLocaleDateString() : ''}
              </p>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Link href="/orders">
                  <Button variant="outline" className="w-full neuro-card border-none" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    Order History
                  </Button>
                </Link>
                <Button variant="outline" className="w-full neuro-card border-none" size="sm">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>

            {/* Account Stats */}
            <div className="glass-card p-6 mt-6">
              <h3 className="font-semibold glass-text mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="glass-text opacity-80">Total Orders</span>
                  <span className="glass-text font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="glass-text opacity-80">Favorite Items</span>
                  <span className="glass-text font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="glass-text opacity-80">Total Spent</span>
                  <span className="glass-text font-medium">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="neuro-card p-1">
                <TabsTrigger value="personal" className="neuro-button">
                  <User className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="preferences" className="neuro-button">
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <div className="hybrid-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold neuro-text">Personal Information</h3>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="neuro-card border-none"
                        size="sm"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="neuro-card border-none"
                          size="sm"
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="neuro-button"
                          size="sm"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-700 border-t-transparent"></div>
                              <span>Saving...</span>
                            </div>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="neuro-text">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`neuro-input pl-10 ${errors.firstName ? 'border-red-500' : ''} ${!isEditing ? 'opacity-60' : ''}`}
                            disabled={!isEditing}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="neuro-text">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`neuro-input ${errors.lastName ? 'border-red-500' : ''} ${!isEditing ? 'opacity-60' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <Label htmlFor="email" className="neuro-text">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          value={formData.email}
                          className="neuro-input pl-10 opacity-60"
                          disabled // Email cannot be changed
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Email address cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <Label htmlFor="phoneNumber" className="neuro-text">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className={`neuro-input pl-10 ${errors.phoneNumber ? 'border-red-500' : ''} ${!isEditing ? 'opacity-60' : ''}`}
                          placeholder="+1 (555) 123-4567"
                          disabled={!isEditing}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                      )}
                    </div>

                    {/* Address Field */}
                    <div>
                      <Label htmlFor="address" className="neuro-text">Default Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={`neuro-input pl-10 min-h-[80px] resize-none ${!isEditing ? 'opacity-60' : ''}`}
                          placeholder="Enter your default delivery address"
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This will be used as your default delivery address for orders.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <div className="hybrid-card p-6">
                  <h3 className="text-lg font-semibold neuro-text mb-6">Preferences & Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Notifications */}
                    <div>
                      <h4 className="font-medium neuro-text mb-3">Notifications</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="neuro-card" defaultChecked />
                          <span className="text-sm text-gray-700">Order status updates</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="neuro-card" defaultChecked />
                          <span className="text-sm text-gray-700">Promotional offers</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="neuro-card" />
                          <span className="text-sm text-gray-700">New menu items</span>
                        </label>
                      </div>
                    </div>

                    <Separator />

                    {/* Dietary Preferences */}
                    <div>
                      <h4 className="font-medium neuro-text mb-3">Dietary Preferences</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Low-carb'].map((dietary) => (
                          <label key={dietary} className="flex items-center space-x-2">
                            <input type="checkbox" className="neuro-card" />
                            <span className="text-sm text-gray-700">{dietary}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Privacy */}
                    <div>
                      <h4 className="font-medium neuro-text mb-3">Privacy</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="neuro-card" defaultChecked />
                          <span className="text-sm text-gray-700">Allow order analytics</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="neuro-card" />
                          <span className="text-sm text-gray-700">Share data for personalized recommendations</span>
                        </label>
                      </div>
                    </div>

                    {/* Save Preferences */}
                    <div className="pt-4">
                      <Button className="neuro-button">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8">
          <div className="border border-red-200 rounded-glass p-6 bg-red-50/50">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">
              These actions are permanent and cannot be undone.
            </p>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}