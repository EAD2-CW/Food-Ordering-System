"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Define cart item type
export interface CartItem {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  categoryId?: string;
}

// Define cart context type
export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: string) => boolean;
}

// Create the context
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// Create provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Initialize cart from localStorage if available
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.warn("Failed to load cart from localStorage:", error);
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }

    // Calculate totals
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotalItems(itemCount);
    setTotalAmount(total);
  }, [items]);

  // Add item to cart
  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => i.itemId === item.itemId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === itemId ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if item is in cart
  const isInCart = useCallback(
    (itemId: string) => {
      return items.some((item) => item.itemId === itemId);
    },
    [items]
  );

  // Context value
  const value = {
    items,
    totalItems,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
