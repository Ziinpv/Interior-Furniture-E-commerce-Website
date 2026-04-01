import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product, products } from '../data/products';
import type { OrderRecord, PlaceOrderInput } from '../types/order';

const CART_STORAGE_KEY = 'noithat_cart_items';
const WISHLIST_STORAGE_KEY = 'noithat_wishlist_items';
const ORDERS_STORAGE_KEY = 'noithat_orders';

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  material?: string;
  size?: string;
}

interface ShopContextValue {
  cartItems: CartItem[];
  wishlist: string[];
  orders: OrderRecord[];
  cartCount: number;
  wishlistCount: number;
  addToCart: (product: Product, options?: Omit<CartItem, 'productId' | 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string, options?: Omit<CartItem, 'productId' | 'quantity'>) => void;
  updateCartItemQuantity: (
    productId: string,
    quantity: number,
    options?: Omit<CartItem, 'productId' | 'quantity'>
  ) => void;
  clearCart: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  placeOrder: (input: PlaceOrderInput) => OrderRecord | null;
  getOrder: (orderId: string) => OrderRecord | undefined;
  completeVnpayPayment: (orderId: string) => void;
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

function sameVariant(
  item: CartItem,
  productId: string,
  options?: Omit<CartItem, 'productId' | 'quantity'>
) {
  return (
    item.productId === productId &&
    item.color === options?.color &&
    item.material === options?.material &&
    item.size === options?.size
  );
}

function parseStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readInitial<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }
  return parseStorage(key, fallback);
}

function generateOrderId(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NT-${t}-${r}`;
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    readInitial(CART_STORAGE_KEY, [] as CartItem[])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readInitial(WISHLIST_STORAGE_KEY, [] as string[])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readInitial(ORDERS_STORAGE_KEY, [] as OrderRecord[])
  );

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addToCart = (
    product: Product,
    options?: Omit<CartItem, 'productId' | 'quantity'>,
    quantity = 1
  ) => {
    if (quantity <= 0) {
      return;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => sameVariant(item, product.id, options));
      if (existingIndex >= 0) {
        return prev.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...prev, { productId: product.id, quantity, ...options }];
    });
  };

  const removeFromCart = (productId: string, options?: Omit<CartItem, 'productId' | 'quantity'>) => {
    setCartItems((prev) => prev.filter((item) => !sameVariant(item, productId, options)));
  };

  const updateCartItemQuantity = (
    productId: string,
    quantity: number,
    options?: Omit<CartItem, 'productId' | 'quantity'>
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, options);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        sameVariant(item, productId, options) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = (input: PlaceOrderInput): OrderRecord | null => {
    if (cartItems.length === 0) {
      return null;
    }

    const lines: OrderRecord['items'] = [];
    let subtotal = 0;

    for (const row of cartItems) {
      const product = products.find((p) => p.id === row.productId);
      if (!product) {
        continue;
      }
      const unitPrice = product.price;
      const lineTotal = unitPrice * row.quantity;
      subtotal += lineTotal;
      lines.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        quantity: row.quantity,
        color: row.color,
        material: row.material,
        size: row.size,
        unitPrice,
        lineTotal,
      });
    }

    if (lines.length === 0) {
      return null;
    }

    const shippingFee = subtotal > 0 ? 30000 : 0;
    const total = subtotal + shippingFee;

    const order: OrderRecord = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: 'processing',
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      address: input.address.trim(),
      note: input.note?.trim() || undefined,
      items: lines,
      subtotal,
      shippingFee,
      total,
    };

    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    return order;
  };

  const getOrder = (orderId: string) => orders.find((o) => o.id === orderId);

  const completeVnpayPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: 'paid' as const } : o
      )
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const value = useMemo<ShopContextValue>(
    () => ({
      cartItems,
      wishlist,
      orders,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      isInWishlist,
      toggleWishlist,
      placeOrder,
      getOrder,
      completeVnpayPayment,
    }),
    [cartItems, wishlist, orders]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
