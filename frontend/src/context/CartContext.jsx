import { createContext, useContext, useState, useCallback } from 'react';
import { cartService, couponService } from '../services';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'nova_mart_guest_cart';

const buildGuestCart = (items = [], savedForLater = [], couponCode = '') => {
  const normalizedItems = items.map((item) => ({
    ...item,
    quantity: Number(item.quantity) || 1,
    price: Number(item.price) || Number(item.product?.finalPrice) || Number(item.product?.price) || 0,
  }));

  const totalItems = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items: normalizedItems,
    savedForLater,
    totalItems,
    totalPrice,
    couponCode,
  };
};

const getGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed ? buildGuestCart(parsed.items || [], parsed.savedForLater || [], parsed.couponCode || '') : buildGuestCart();
  } catch {
    return buildGuestCart();
  }
};

const saveGuestCart = (cart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

const guestProductFromData = (product, quantity = 1) => {
  const normalized = {
    _id: product?._id || product?.id,
    product: {
      _id: product?._id || product?.id,
      name: product?.name,
      slug: product?.slug,
      price: Number(product?.price ?? product?.finalPrice ?? 0),
      finalPrice: Number(product?.finalPrice ?? product?.price ?? 0),
      discount: Number(product?.discount ?? 0),
      stock: Number(product?.stock ?? 0),
      brand: product?.brand || 'NOVA MART',
      images: product?.images || [],
    },
    quantity,
    price: Number(product?.finalPrice ?? product?.price ?? 0),
  };

  return normalized;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      setCart(guestCart);
      setPricing(null);
      return;
    }

    setLoading(true);
    try {
      const { data } = await cartService.get();
      setCart(data.data);
      setPricing(data.pricing);
    } catch {
      setCart(null);
      setPricing(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshPricing = async (deliveryOption = 'standard') => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const shippingPrice = guestCart.totalPrice > 999 ? 0 : 49;
      const taxPrice = Math.round(guestCart.totalPrice * 0.18);
      const totalPrice = guestCart.totalPrice + shippingPrice + taxPrice;
      setPricing({ itemsPrice: guestCart.totalPrice, discountPrice: 0, shippingPrice, taxPrice, totalPrice });
      return;
    }

    try {
      const { data } = await cartService.getSummary({ deliveryOption });
      setPricing(data.data);
    } catch { /* ignore */ }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const existing = guestCart.items.find((item) => item._id === (product?._id || product?.id));

      if (existing) {
        existing.quantity += Number(quantity) || 1;
      } else {
        guestCart.items.push(guestProductFromData(product, Number(quantity) || 1));
      }

      const nextCart = buildGuestCart(guestCart.items, guestCart.savedForLater || [], guestCart.couponCode || '');
      saveGuestCart(nextCart);
      setCart(nextCart);
      await refreshPricing();
      return nextCart;
    }

    const productId = product?._id || product?.id;
    const { data } = await cartService.addItem(productId, quantity);
    setCart(data.data);
    await refreshPricing();
    return data.data;
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const nextItems = guestCart.items
        .map((item) => (item._id === itemId ? { ...item, quantity: Math.max(0, Number(quantity) || 0) } : item))
        .filter((item) => item.quantity > 0);

      const nextCart = buildGuestCart(nextItems, guestCart.savedForLater || [], guestCart.couponCode || '');
      saveGuestCart(nextCart);
      setCart(nextCart);
      await refreshPricing();
      return nextCart;
    }

    const { data } = await cartService.updateItem(itemId, quantity);
    setCart(data.data);
    await refreshPricing();
    return data.data;
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const nextItems = guestCart.items.filter((item) => item._id !== itemId);
      const nextCart = buildGuestCart(nextItems, guestCart.savedForLater || [], guestCart.couponCode || '');
      saveGuestCart(nextCart);
      setCart(nextCart);
      await refreshPricing();
      return nextCart;
    }

    const { data } = await cartService.removeItem(itemId);
    setCart(data.data);
    await refreshPricing();
    return data.data;
  };

  const saveForLater = async (itemId) => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const item = guestCart.items.find((entry) => entry._id === itemId);
      if (!item) return guestCart;

      const nextItems = guestCart.items.filter((entry) => entry._id !== itemId);
      const saved = [...(guestCart.savedForLater || []), item];
      const nextCart = buildGuestCart(nextItems, saved, guestCart.couponCode || '');
      saveGuestCart(nextCart);
      setCart(nextCart);
      await refreshPricing();
      return nextCart;
    }

    const { data } = await cartService.saveForLater(itemId);
    setCart(data.data);
    await refreshPricing();
    return data.data;
  };

  const moveToCart = async (itemId) => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const item = guestCart.savedForLater?.find((entry) => entry._id === itemId);
      if (!item) return guestCart;

      const nextSaved = guestCart.savedForLater.filter((entry) => entry._id !== itemId);
      const nextItems = [...guestCart.items, { ...item, quantity: Math.max(1, Number(item.quantity) || 1) }];
      const nextCart = buildGuestCart(nextItems, nextSaved, guestCart.couponCode || '');
      saveGuestCart(nextCart);
      setCart(nextCart);
      await refreshPricing();
      return nextCart;
    }

    const { data } = await cartService.moveToCart(itemId);
    setCart(data.data);
    await refreshPricing();
    return data.data;
  };

  const applyCoupon = async (code) => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const nextCart = { ...guestCart, couponCode: code };
      saveGuestCart(nextCart);
      setCart(nextCart);
      return nextCart;
    }

    await couponService.validate(code);
    await fetchCart();
  };

  const removeCoupon = async () => {
    if (!isAuthenticated) {
      const guestCart = getGuestCart();
      const nextCart = { ...guestCart, couponCode: '' };
      saveGuestCart(nextCart);
      setCart(nextCart);
      return nextCart;
    }

    await couponService.remove();
    await fetchCart();
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      const emptyCart = buildGuestCart();
      saveGuestCart(emptyCart);
      setCart(emptyCart);
      setPricing(null);
      return emptyCart;
    }

    const { data } = await cartService.clear();
    setCart(data.data);
    setPricing(null);
    return data.data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        pricing,
        loading,
        cartCount: cart?.totalItems || 0,
        cartTotal: cart?.totalPrice || 0,
        fetchCart,
        refreshPricing,
        addToCart,
        updateQuantity,
        removeItem,
        saveForLater,
        moveToCart,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
