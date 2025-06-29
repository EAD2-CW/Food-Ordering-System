'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Package, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { menuService } from '@/services/menuService';
import { Category, MenuItem } from '@/types/menu';
import { UserRole } from '@/types/auth';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeleteConfirmDialog } from '@/components/common/ConfirmDialog';

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteItem, setDeleteItem] = useState<{ type: 'category' | 'item'; id: number; name: string } | null>(null);
  
  const { addNotification } = useNotification();

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        menuService.getAllCategories(),
        menuService.getAllMenuItems()
      ]);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (error: any) {
      console.error('Failed to load menu data:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Load Menu',
        message: 'Unable to load menu data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleItemAvailability = async (itemId: number, isAvailable: boolean) => {
    try {
      await menuService.toggleItemAvailability(itemId, !isAvailable);
      setMenuItems(prev => 
        prev.map(item => 
          item.itemId === itemId ? { ...item, isAvailable: !isAvailable } : item
        )
      );
      addNotification({
        type: 'success',
        title: 'Item Updated',
        message: `Item availability updated successfully.`,
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update item availability.',
      });
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await menuService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
      // Also remove items from this category
      setMenuItems(prev => prev.filter(item => item.categoryId !== categoryId));
      addNotification({
        type: 'success',
        title: 'Category Deleted',
        message: 'Category and all its items have been deleted.',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'Failed to delete category.',
      });
    } finally {
      setDeleteItem(null);
    }
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    try {
      await menuService.deleteMenuItem(itemId);
      setMenuItems(prev => prev.filter(item => item.itemId !== itemId));
      addNotification({
        type: 'success',
        title: 'Item Deleted',
        message: 'Menu item has been deleted.',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'Failed to delete menu item.',
      });
    } finally {
      setDeleteItem(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const filteredItems = menuItems.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="hybrid-card p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold neuro-text">Menu Management</h1>
              <p className="text-gray-600">
                {categories.length} categories • {menuItems.length} items
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={loadMenuData} variant="outline" className="neuro-card border-none">
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="neuro-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-none">
                  <DialogHeader>
                    <DialogTitle className="glass-text">Add New Menu Item</DialogTitle>
                  </DialogHeader>
                  <div className="glass-text p-4">
                    <p>Menu item creation form would go here...</p>
                    <p className="text-sm opacity-80 mt-2">
                      This would include fields for name, description, price, category selection, image upload, etc.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="items" className="space-y-6">
            <TabsList className="neuro-card p-1">
              <TabsTrigger value="items" className="neuro-button">
                <Package className="h-4 w-4 mr-2" />
                Menu Items ({menuItems.length})
              </TabsTrigger>
              <TabsTrigger value="categories" className="neuro-button">
                <Package className="h-4 w-4 mr-2" />
                Categories ({categories.length})
              </TabsTrigger>
            </TabsList>

            {/* Menu Items Tab */}
            <TabsContent value="items">
              {/* Search */}
              <div className="hybrid-card p-4 mb-6">
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="neuro-input"
                />
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const category = categories.find(cat => cat.categoryId === item.categoryId);
                  return (
                    <div key={item.itemId} className="hybrid-card p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="neuro-card p-3 w-16 h-16 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover rounded" />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-lg font-semibold neuro-text">{item.itemName}</h3>
                              <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                {item.isAvailable ? 'Available' : 'Unavailable'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Category: {category?.categoryName || 'Unknown'}</span>
                              <span>Price: {formatPrice(item.price)}</span>
                              {item.preparationTime && (
                                <span>Prep: {item.preparationTime}min</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleItemAvailability(item.itemId, item.isAvailable)}
                            className="neuro-card border-none"
                          >
                            {item.isAvailable ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="neuro-card border-none"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteItem({ type: 'item', id: item.itemId, name: item.itemName })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredItems.length === 0 && (
                  <div className="text-center py-16">
                    <div className="neuro-card p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold neuro-text mb-2">No Items Found</h2>
                    <p className="text-gray-600">
                      {searchQuery ? 'No items match your search.' : 'No menu items available.'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const itemCount = menuItems.filter(item => item.categoryId === category.categoryId).length;
                  return (
                    <div key={category.categoryId} className="hybrid-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="neuro-card p-2 w-12 h-12 flex items-center justify-center">
                            {category.imageUrl ? (
                              <img src={category.imageUrl} alt={category.categoryName} className="w-full h-full object-cover rounded" />
                            ) : (
                              <span className="text-2xl">🍽️</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold neuro-text">{category.categoryName}</h3>
                            <p className="text-sm text-gray-600">{itemCount} items</p>
                          </div>
                        </div>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      {category.description && (
                        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="neuro-card border-none flex-1"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteItem({ type: 'category', id: category.categoryId, name: category.categoryName })}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {/* Add Category Card */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="hybrid-card p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors">
                      <div className="text-center">
                        <div className="neuro-card p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Plus className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-medium neuro-text mb-2">Add Category</h3>
                        <p className="text-sm text-gray-600">Create a new menu category</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-none">
                    <DialogHeader>
                      <DialogTitle className="glass-text">Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="glass-text p-4">
                      <p>Category creation form would go here...</p>
                      <p className="text-sm opacity-80 mt-2">
                        This would include fields for name, description, image upload, display order, etc.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmDialog
            isOpen={deleteItem !== null}
            onClose={() => setDeleteItem(null)}
            onConfirm={() => {
              if (deleteItem) {
                if (deleteItem.type === 'category') {
                  handleDeleteCategory(deleteItem.id);
                } else {
                  handleDeleteMenuItem(deleteItem.id);
                }
              }
            }}
            itemName={deleteItem?.name || ''}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}