export const FALLBACK_CATEGORIES = [
  { _id: 'c1', id: 'c1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&fit=crop' },
  { _id: 'c2', id: 'c2', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&fit=crop' },
  { _id: 'c3', id: 'c3', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&fit=crop' },
  { _id: 'c4', id: 'c4', name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&fit=crop' },
  { _id: 'c5', id: 'c5', name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=600&fit=crop' },
  { _id: 'c6', id: 'c6', name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&fit=crop' },
];

export const FALLBACK_PRODUCTS = [
  {
    _id: 'p1',
    id: 'p1',
    name: 'Nova SoundPro Wireless Noise Cancelling Earbuds',
    title: 'Nova SoundPro Wireless Noise Cancelling Earbuds',
    slug: 'nova-soundpro-wireless-earbuds',
    description: 'Industry-leading active noise cancellation with 35dB depth, 36-hour battery life with USB-C fast charging, spatial audio, and IPX5 sweat resistance.',
    price: 4999,
    discount: 25,
    finalPrice: 3749,
    final_price: 3749,
    category: { _id: 'c1', name: 'Electronics', slug: 'electronics' },
    category_slug: 'electronics',
    brand: 'Nova Audio',
    images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&fit=crop' }],
    stock: 120,
    rating: { average: 4.8, count: 432 },
    numReviews: 432,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
  },
  {
    _id: 'p2',
    id: 'p2',
    name: 'Apex Pro 1.96-inch AMOLED Bluetooth Calling Smartwatch',
    title: 'Apex Pro 1.96-inch AMOLED Bluetooth Calling Smartwatch',
    slug: 'apex-pro-amoled-smartwatch',
    description: 'Vibrant 1.96-inch AMOLED display with Always-On feature, AI voice assistant, heart rate and SpO2 tracking, and 7-day battery.',
    price: 3999,
    discount: 30,
    finalPrice: 2799,
    final_price: 2799,
    category: { _id: 'c1', name: 'Electronics', slug: 'electronics' },
    category_slug: 'electronics',
    brand: 'Apex Tech',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop' }],
    stock: 85,
    rating: { average: 4.7, count: 289 },
    numReviews: 289,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
  },
  {
    _id: 'p3',
    id: 'p3',
    name: 'VoltStream 65W GaN Fast Charger Multi-Port Adapter',
    title: 'VoltStream 65W GaN Fast Charger Multi-Port Adapter',
    slug: 'voltstream-65w-gan-fast-charger',
    description: 'Ultra-compact Gallium Nitride 65W high-speed charger with dual USB-C ports and USB-A port for laptops and smartphones.',
    price: 2499,
    discount: 20,
    finalPrice: 1999,
    final_price: 1999,
    category: { _id: 'c1', name: 'Electronics', slug: 'electronics' },
    category_slug: 'electronics',
    brand: 'VoltStream',
    images: [{ url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&fit=crop' }],
    stock: 200,
    rating: { average: 4.9, count: 512 },
    numReviews: 512,
    isDeal: false,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
  },
  {
    _id: 'p4',
    id: 'p4',
    name: 'AeroBeat Bass Boost Portable Wireless Speaker',
    title: 'AeroBeat Bass Boost Portable Wireless Speaker',
    slug: 'aerobeat-bass-portable-speaker',
    description: '360-degree immersive HD stereo sound with 24W output, dual passive bass radiators, and IPX7 waterproofing.',
    price: 3499,
    discount: 28,
    finalPrice: 2499,
    final_price: 2499,
    category: { _id: 'c1', name: 'Electronics', slug: 'electronics' },
    category_slug: 'electronics',
    brand: 'Nova Audio',
    images: [{ url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&fit=crop' }],
    stock: 65,
    rating: { average: 4.6, count: 178 },
    numReviews: 178,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
  },
  {
    _id: 'p5',
    id: 'p5',
    name: 'UltraPure Cotton Relaxed Fit Oxford Shirt',
    title: 'UltraPure Cotton Relaxed Fit Oxford Shirt',
    slug: 'ultrapure-cotton-oxford-shirt',
    description: '100% breathable organic combed cotton tailored with classic button-down collar and mother-of-pearl buttons.',
    price: 2299,
    discount: 35,
    finalPrice: 1494,
    final_price: 1494,
    category: { _id: 'c2', name: 'Fashion', slug: 'fashion' },
    category_slug: 'fashion',
    brand: 'Aura Cotton',
    images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&fit=crop' }],
    stock: 90,
    rating: { average: 4.6, count: 320 },
    numReviews: 320,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
  },
  {
    _id: 'p6',
    id: 'p6',
    name: 'UrbanFlex Active Stretch Performance Chinos',
    title: 'UrbanFlex Active Stretch Performance Chinos',
    slug: 'urbanflex-active-stretch-chinos',
    description: 'Wrinkle-resistant four-way stretch fabric engineered for modern commuters and active all-day wear.',
    price: 2799,
    discount: 25,
    finalPrice: 2099,
    final_price: 2099,
    category: { _id: 'c2', name: 'Fashion', slug: 'fashion' },
    category_slug: 'fashion',
    brand: 'Aura Cotton',
    images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&fit=crop' }],
    stock: 70,
    rating: { average: 4.5, count: 195 },
    numReviews: 195,
    isDeal: false,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
  },
];

export function getMockResponse(url, params = {}) {
  const cleanUrl = url.replace(/^\/api/, '');

  if (cleanUrl.startsWith('/categories')) {
    return {
      data: {
        success: true,
        data: FALLBACK_CATEGORIES,
      },
    };
  }

  if (cleanUrl.startsWith('/products/slug/')) {
    const slug = cleanUrl.replace('/products/slug/', '').split('/')[0];
    const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug) || FALLBACK_PRODUCTS[0];
    return {
      data: {
        success: true,
        data: product,
      },
    };
  }

  if (cleanUrl.startsWith('/products')) {
    let list = [...FALLBACK_PRODUCTS];

    if (params.bestsellers || params.isBestSeller) {
      list = list.filter((p) => p.isBestSeller);
    }
    if (params.category) {
      list = list.filter((p) => p.category_slug === params.category || p.category?.slug === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    return {
      data: {
        success: true,
        data: {
          products: list,
          pagination: {
            page: 1,
            pages: 1,
            total: list.length,
          },
        },
      },
    };
  }

  return {
    data: {
      success: true,
      data: [],
    },
  };
}
