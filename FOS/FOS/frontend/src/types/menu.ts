// src/types/menu.ts
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
  category?: Category;
}

export interface MenuItemRequest {
  categoryId: number;
  itemName: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
  imageUrl?: string;
  preparationTime?: number;
  ingredients?: string;
  dietaryInfo?: string;
  calories?: number;
}

export interface CategoryRequest {
  categoryName: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface CartItem {
  itemId: number;
  itemName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  specialInstructions?: string;
  preparationTime?: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, instructions?: string) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  updateInstructions: (itemId: number, instructions: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalPreparationTime: () => number;
}

export interface MenuSearchFilters {
  category?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  dietaryInfo?: string[];
  sortBy?: 'name' | 'price' | 'preparation' | 'calories';
  sortOrder?: 'asc' | 'desc';
}