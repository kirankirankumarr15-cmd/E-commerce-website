import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { wishlistService } from '../services';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const GUEST_WISHLIST_KEY = 'nova_mart_guest_wishlist';

const normalizeProduct = (product) => ({
  _id: product?._id || product?.id,
  name: product?.name,
  slug: product?.slug,
  images: product?.images || [],
  finalPrice: product?.finalPrice ?? product?.price ?? 0,
  price: product?.price ?? product?.finalPrice ?? 0,
  discount: product?.discount ?? 0,
  rating: product?.rating ?? 0,
  stock: product?.stock ?? 0,
  brand: product?.brand || 'NOVA MART',
});

const getGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestWishlist = (products) => {
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(products));
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist({ products: getGuestWishlist() });
      return;
    }

    setLoading(true);
    try {
      const { data } = await wishlistService.get();
      setWishlist(data.data);
    } catch {
      setWishlist({ products: [] });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    const normalized = normalizeProduct(product);

    if (!isAuthenticated) {
      const guestWishlist = getGuestWishlist();
      const alreadyExists = guestWishlist.some((item) => item._id === normalized._id);
      const nextProducts = alreadyExists ? guestWishlist : [normalized, ...guestWishlist];
      saveGuestWishlist(nextProducts);
      setWishlist({ products: nextProducts });
      return { products: nextProducts };
    }

    const { data } = await wishlistService.add(normalized._id);
    setWishlist(data.data);
    return data.data;
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      const guestWishlist = getGuestWishlist().filter((item) => item._id !== productId);
      saveGuestWishlist(guestWishlist);
      setWishlist({ products: guestWishlist });
      return { products: guestWishlist };
    }

    const { data } = await wishlistService.remove(productId);
    setWishlist(data.data);
    return data.data;
  };

  const isInWishlist = (productId) => {
    return wishlist?.products?.some((p) => p._id === productId) || false;
  };

  const toggleWishlist = async (product) => {
    const productId = product?._id || product?.id;

    if (!productId) {
      return { products: wishlist?.products || [] };
    }

    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    }

    return addToWishlist(product);
  };

  const moveToCart = async (productId) => {
    if (!isAuthenticated) {
      return { wishlist: { products: getGuestWishlist() } };
    }

    const { data } = await wishlistService.moveToCart(productId);
    setWishlist(data.data.wishlist);
    return data.data;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount: wishlist?.products?.length || 0,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
