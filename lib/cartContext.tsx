"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SeedProduct } from "./seedData";

export interface CartItem {
  product: SeedProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  saved: CartItem[];
  cartCount: number;
  addToCart: (product: SeedProduct, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "amazon_nova_cart";
const SAVED_KEY = "amazon_nova_saved";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawSaved = localStorage.getItem(SAVED_KEY);
      if (rawSaved) setSaved(JSON.parse(rawSaved));
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    }
  }, [items, saved, mounted]);

  const addToCart = (product: SeedProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const saveForLater = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      setSaved((prev) => [...prev, item]);
    }
  };

  const moveToCart = (productId: string) => {
    const item = saved.find((i) => i.product.id === productId);
    if (item) {
      setSaved((prev) => prev.filter((i) => i.product.id !== productId));
      setItems((prev) => [...prev, item]);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const itemsPrice = items.reduce((acc, i) => acc + i.product.final_price * i.quantity, 0);
  const shippingPrice = itemsPrice > 499 || itemsPrice === 0 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        items,
        saved,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater,
        moveToCart,
        clearCart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
