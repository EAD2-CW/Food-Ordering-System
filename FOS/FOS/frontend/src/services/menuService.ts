// src/services/menuService.ts - Menu Service API Calls

import { menuServiceApi, apiCall, API_PATHS } from './api';

// Menu-related interfaces
export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  itemId: number;
  categoryId: number;
  itemName: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
  preparationTime?: number;
  ingredients?: string;
  dietaryInfo?: string;
  calories?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDTO {
  categoryId: number;
  categoryName: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  itemCount?: number;
  menuItems?: MenuItemDTO[];
}

export interface MenuItemDTO {
  itemId: number;
  categoryId: number;
  itemName: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
  preparationTime?: number;
  ingredients?: string;
  dietaryInfo?: string;
  calories?: number;
  categoryName?: string;
}

export interface MenuItemRequestDTO {
  categoryId: number;
  itemName: string;
  description?: string;
  price: number;
  imageUrl?: string;
  preparationTime?: number;
  ingredients?: string;
  dietaryInfo?: string;
  calories?: number;
}

// Menu Service API functions
export const menuService = {
  // Category Management
  
  // Get all active categories
  getActiveCategories: async (): Promise<CategoryDTO[]> => {
    const response = await apiCall<CategoryDTO[]>(
      menuServiceApi,
      'GET',
      API_PATHS.MENU.CATEGORIES
    );
    return response;
  },

  // Get all categories (Admin)
  getAllCategories: async (): Promise<CategoryDTO[]> => {
    const response = await apiCall<CategoryDTO[]>(
      menuServiceApi,
      'GET',
      `${API_PATHS.MENU.CATEGORIES}/all`
    );
    return response;
  },

  // Get category by ID
  getCategoryById: async (categoryId: number): Promise<CategoryDTO> => {
    const response = await apiCall<CategoryDTO>(
      menuServiceApi,
      'GET',
      `${API_PATHS.MENU.CATEGORIES}/${categoryId}`
    );
    return response;
  },

  // Get categories with their menu items
  getCategoriesWithItems: async (): Promise<CategoryDTO[]> => {
    const response = await apiCall<CategoryDTO[]>(
      menuServiceApi,
      'GET',
      API_PATHS.MENU.CATEGORIES_WITH_ITEMS
    );
    return response;
  },

  // Create new category (Admin)
  createCategory: async (categoryData: Omit<CategoryDTO, 'categoryId' | 'itemCount'>): Promise<CategoryDTO> => {
    const response = await apiCall<CategoryDTO>(
      menuServiceApi,
      'POST',
      API_PATHS.MENU.CATEGORIES,
      categoryData
    );
    return response;
  },

  // Update category (Admin)
  updateCategory: async (categoryId: number, categoryData: Partial<CategoryDTO>): Promise<CategoryDTO> => {
    const response = await apiCall<CategoryDTO>(
      menuServiceApi,
      'PUT',
      `${API_PATHS.MENU.CATEGORIES}/${categoryId}`,
      categoryData
    );
    return response;
  },

  // Delete category (Admin)
  deleteCategory: async (categoryId: number): Promise<void> => {
    await apiCall<void>(
      menuServiceApi,
      'DELETE',
      `${API_PATHS.MENU.CATEGORIES}/${categoryId}`
    );
  },

  // Menu Item Management

  // Get all available menu items
  getAvailableMenuItems: async (): Promise<MenuItemDTO[]> => {
    const response = await apiCall<MenuItemDTO[]>(
      menuServiceApi,
      'GET',
      API_PATHS.MENU.ITEMS
    );
    return response;
  },

  // Get all menu items (Admin)
  getAllMenuItems: async (): Promise<MenuItemDTO[]> => {
    const response = await apiCall<MenuItemDTO[]>(
      menuServiceApi,
      'GET',
      `${API_PATHS.MENU.ITEMS}/all`
    );
    return response;
  },

  // Get menu item by ID
  getMenuItemById: async (itemId: number): Promise<MenuItemDTO> => {
    const response = await apiCall<MenuItemDTO>(
      menuServiceApi,
      'GET',
      `${API_PATHS.MENU.ITEMS}/${itemId}`
    );
    return response;
  },

  // Get menu items by category
  getMenuItemsByCategory: async (categoryId: number): Promise<MenuItemDTO[]> => {
    const response = await apiCall<MenuItemDTO[]>(
      menuServiceApi,
      'GET',
      `${API_PATHS.MENU.ITEMS_BY_CATEGORY}/${categoryId}`
    );
    return response;
  },

  // Search menu items
  searchMenuItems: async (searchTerm: string): Promise<MenuItemDTO[]> => {
    const response = await apiCall<MenuItemDTO[]>(
      menuServiceApi,
      'GET',
      `${API_PATHS.MENU.SEARCH_ITEMS}?q=${encodeURIComponent(searchTerm)}`
    );
    return response;
  },

  // Create new menu item (Admin)
  createMenuItem: async (itemData: MenuItemRequestDTO): Promise<MenuItemDTO> => {
    const response = await apiCall<MenuItemDTO>(
      menuServiceApi,
      'POST',
      API_PATHS.MENU.ITEMS,
      itemData
    );
    return response;
  },

  // Update menu item (Admin)
  updateMenuItem: async (itemId: number, itemData: Partial<MenuItemRequestDTO>): Promise<MenuItemDTO> => {
    const response = await apiCall<MenuItemDTO>(
      menuServiceApi,
      'PUT',
      `${API_PATHS.MENU.ITEMS}/${itemId}`,
      itemData
    );
    return response;
  },

  // Toggle menu item availability (Admin)
  toggleItemAvailability: async (itemId: number, isAvailable: boolean): Promise<MenuItemDTO> => {
    const response = await apiCall<MenuItemDTO>(
      menuServiceApi,
      'PATCH',
      `${API_PATHS.MENU.ITEMS}/${itemId}/availability?isAvailable=${isAvailable}`
    );
    return response;
  },

  // Delete menu item (Admin)
  deleteMenuItem: async (itemId: number): Promise<void> => {
    await apiCall<void>(
      menuServiceApi,
      'DELETE',
      `${API_PATHS.MENU.ITEMS}/${itemId}`
    );
  },

  // Utility Functions

  // Format price for display
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  },

  // Get dietary tags from dietary info string
  getDietaryTags: (dietaryInfo?: string): string[] => {
    if (!dietaryInfo) return [];
    return dietaryInfo.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  },

  // Format preparation time
  formatPreparationTime: (minutes?: number): string => {
    if (!minutes) return 'Time varies';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  },

  // Get ingredient list from ingredients string
  getIngredientList: (ingredients?: string): string[] => {
    if (!ingredients) return [];
    return ingredients.split(',').map(ingredient => ingredient.trim()).filter(ingredient => ingredient.length > 0);
  },

  // Filter menu items by dietary preferences
  filterByDietary: (menuItems: MenuItemDTO[], dietaryFilter: string): MenuItemDTO[] => {
    if (!dietaryFilter || dietaryFilter === 'all') return menuItems;
    return menuItems.filter(item => 
      item.dietaryInfo?.toLowerCase().includes(dietaryFilter.toLowerCase())
    );
  },

  // Sort menu items
  sortMenuItems: (menuItems: MenuItemDTO[], sortBy: 'name' | 'price' | 'time'): MenuItemDTO[] => {
    return [...menuItems].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.itemName.localeCompare(b.itemName);
        case 'price':
          return a.price - b.price;
        case 'time':
          return (a.preparationTime || 0) - (b.preparationTime || 0);
        default:
          return 0;
      }
    });
  },

  // Get menu items by price range
  filterByPriceRange: (menuItems: MenuItemDTO[], minPrice: number, maxPrice: number): MenuItemDTO[] => {
    return menuItems.filter(item => item.price >= minPrice && item.price <= maxPrice);
  },

  // Get available menu items only
  getAvailableItems: (menuItems: MenuItemDTO[]): MenuItemDTO[] => {
    return menuItems.filter(item => item.isAvailable);
  },

  // Group menu items by category
  groupItemsByCategory: (menuItems: MenuItemDTO[]): Record<string, MenuItemDTO[]> => {
    return menuItems.reduce((groups, item) => {
      const categoryName = item.categoryName || 'Other';
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(item);
      return groups;
    }, {} as Record<string, MenuItemDTO[]>);
  },

  // Calculate total calories for multiple items
  calculateTotalCalories: (items: { menuItem: MenuItemDTO; quantity: number }[]): number => {
    return items.reduce((total, { menuItem, quantity }) => {
      return total + (menuItem.calories || 0) * quantity;
    }, 0);
  },

  // Get recommended items (based on popularity or rating - placeholder)
  getRecommendedItems: async (limit: number = 6): Promise<MenuItemDTO[]> => {
    const allItems = await menuService.getAvailableMenuItems();
    // For now, return random items. In a real app, this would be based on analytics
    return allItems.slice(0, limit);
  },

  // Validate menu item data
  validateMenuItem: (itemData: MenuItemRequestDTO): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!itemData.itemName || itemData.itemName.trim().length === 0) {
      errors.push('Item name is required');
    }

    if (!itemData.categoryId || itemData.categoryId <= 0) {
      errors.push('Valid category is required');
    }

    if (!itemData.price || itemData.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (itemData.preparationTime && itemData.preparationTime < 0) {
      errors.push('Preparation time cannot be negative');
    }

    if (itemData.calories && itemData.calories < 0) {
      errors.push('Calories cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Export default
export default menuService;