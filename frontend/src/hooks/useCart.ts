import { useState, useCallback } from 'react';
import { Cart, CartItem } from '../types';

export function useCart(initialCart?: Cart) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (initialCart) {
      return initialCart.items;
    }
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const addItem = useCallback((item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.productId === item.productId);
      if (existingItem) {
        return prevCart.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevCart, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Persist to localStorage whenever cart changes
  const saveCart = useCallback(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return {
    items: cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    saveCart,
  };
}
