export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDiscount = (price, discount) => {
  return price - (price * discount) / 100;
};

export const getProductImage = (product, type = 'main') => {
  if (!product?.images?.length) return '/placeholder-product.jpg';
  const img = product.images.find((i) => i.type === type) || product.images[0];
  return img.url;
};

export const truncate = (str, length = 100) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const RECENTLY_VIEWED_KEY = 'nova_mart_recently_viewed';
export const MAX_RECENTLY_VIEWED = 8;

export const getRecentlyViewed = () => {
  try {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (product) => {
  try {
    const items = getRecentlyViewed().filter((p) => p._id !== product._id);
    items.unshift({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      finalPrice: product.finalPrice,
      price: product.price,
      discount: product.discount,
      images: product.images,
      rating: product.rating,
    });
    localStorage.setItem(
      RECENTLY_VIEWED_KEY,
      JSON.stringify(items.slice(0, MAX_RECENTLY_VIEWED))
    );
  } catch {
    // silently fail
  }
};
