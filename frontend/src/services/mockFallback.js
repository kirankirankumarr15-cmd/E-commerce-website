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
    images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&fit=crop', type: 'main' }],
    stock: 120,
    rating: 4.8,
    numReviews: 432,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
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
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop', type: 'main' }],
    stock: 85,
    rating: 4.7,
    numReviews: 289,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
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
    images: [{ url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&fit=crop', type: 'main' }],
    stock: 200,
    rating: 4.9,
    numReviews: 512,
    isDeal: false,
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isTrending: false,
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
    images: [{ url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&fit=crop', type: 'main' }],
    stock: 65,
    rating: 4.6,
    numReviews: 178,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    isTrending: true,
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
    images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&fit=crop', type: 'main' }],
    stock: 90,
    rating: 4.6,
    numReviews: 320,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
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
    images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&fit=crop', type: 'main' }],
    stock: 70,
    rating: 4.5,
    numReviews: 195,
    isDeal: false,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    isTrending: false,
  },
];

export const FALLBACK_ORDERS = [
  {
    _id: 'ord_101',
    orderNumber: 'ORD-948123',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    orderStatus: 'delivered',
    totalPrice: 3749,
    itemsPrice: 3749,
    shippingPrice: 0,
    taxPrice: 187,
    discountPrice: 0,
    paymentMethod: 'cod',
    paymentStatus: 'completed',
    user: {
      _id: 'u_demo',
      firstName: 'Kiran',
      lastName: 'Kumar',
      email: 'customer@novamart.com',
    },
    shippingAddress: {
      fullName: 'Kiran Kumar',
      phone: '9876543210',
      street: '123 Nova High St, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    items: [
      {
        _id: 'item_1',
        quantity: 1,
        price: 3749,
        product: FALLBACK_PRODUCTS[0],
      },
    ],
  },
  {
    _id: 'ord_102',
    orderNumber: 'ORD-827419',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    orderStatus: 'shipped',
    totalPrice: 2799,
    itemsPrice: 2799,
    shippingPrice: 0,
    taxPrice: 140,
    discountPrice: 0,
    paymentMethod: 'online',
    paymentStatus: 'completed',
    user: {
      _id: 'u_demo',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya@example.com',
    },
    shippingAddress: {
      fullName: 'Priya Sharma',
      phone: '9876543211',
      street: '45 MG Road, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
    },
    items: [
      {
        _id: 'item_2',
        quantity: 1,
        price: 2799,
        product: FALLBACK_PRODUCTS[1],
      },
    ],
  },
  {
    _id: 'ord_103',
    orderNumber: 'ORD-719384',
    createdAt: new Date().toISOString(),
    orderStatus: 'pending',
    totalPrice: 1299,
    itemsPrice: 1299,
    shippingPrice: 49,
    taxPrice: 65,
    discountPrice: 0,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    user: {
      _id: 'u_demo',
      firstName: 'Rahul',
      lastName: 'Verma',
      email: 'rahul@example.com',
    },
    shippingAddress: {
      fullName: 'Rahul Verma',
      phone: '9876543212',
      street: '78 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      country: 'India',
    },
    items: [
      {
        _id: 'item_3',
        quantity: 1,
        price: 1299,
        product: FALLBACK_PRODUCTS[2],
      },
    ],
  },
];

export function getMockResponse(rawUrl = '', params = {}, reqData = {}) {
  let cleanUrl = (rawUrl || '').replace(/^https?:\/\/[^\/]+/, '').replace(/^\/api/, '');
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = '/' + cleanUrl;
  }

  // --- AUTH SERVICES ---
  if (cleanUrl.startsWith('/auth')) {
    const isLoginPage = cleanUrl.includes('login');
    const isRegister = cleanUrl.includes('register');
    const isOtp = cleanUrl.includes('verify-otp') || cleanUrl.includes('forgot');
    const email = reqData.email || params.email || localStorage.getItem('nova_user_email') || 'customer@novamart.com';
    const isAdmin = email.includes('admin') || localStorage.getItem('nova_demo_role') === 'admin';

    const mockUser = {
      _id: 'u_demo_' + (isAdmin ? 'admin' : 'cust'),
      firstName: isAdmin ? 'Admin' : 'Kiran',
      lastName: isAdmin ? 'User' : 'Kumar',
      name: isAdmin ? 'Admin User' : 'Kiran Kumar',
      email: email,
      role: isAdmin ? 'admin' : 'customer',
      phone: '9876543210',
      addresses: [
        {
          _id: 'addr_1',
          fullName: isAdmin ? 'Admin User' : 'Kiran Kumar',
          phone: '9876543210',
          street: '123 Nova High St, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          label: 'Home',
          isDefault: true,
        },
      ],
    };

    if (cleanUrl.includes('addresses')) {
      return {
        data: {
          success: true,
          message: 'Address saved successfully',
          data: mockUser.addresses,
        },
      };
    }

    return {
      data: {
        success: true,
        data: {
          token: 'nova_jwt_token_demo_98765',
          user: mockUser,
          ...mockUser,
        },
      },
    };
  }

  // --- CATEGORIES ---
  if (cleanUrl.startsWith('/categories/')) {
    const slug = cleanUrl.replace('/categories/', '').split('/')[0];
    const category =
      FALLBACK_CATEGORIES.find((c) => c.slug === slug || c._id === slug || c.id === slug) ||
      FALLBACK_CATEGORIES[0];
    return {
      data: {
        success: true,
        data: category,
      },
    };
  }

  if (cleanUrl === '/categories' || cleanUrl.startsWith('/categories')) {
    return {
      data: {
        success: true,
        data: FALLBACK_CATEGORIES,
      },
    };
  }

  // --- PRODUCTS ---
  if (cleanUrl.startsWith('/products/brands')) {
    return {
      data: {
        success: true,
        data: ['Nova Audio', 'Apex Tech', 'VoltStream', 'Aura Cotton', 'PureGlow', 'IronCore'],
      },
    };
  }

  if (cleanUrl.startsWith('/products/trending')) {
    return {
      data: {
        success: true,
        data: FALLBACK_PRODUCTS.filter((p) => p.isTrending || p.isBestSeller),
      },
    };
  }

  if (cleanUrl.startsWith('/products/best-sellers')) {
    return {
      data: {
        success: true,
        data: FALLBACK_PRODUCTS.filter((p) => p.isBestSeller),
      },
    };
  }

  if (cleanUrl.startsWith('/products/deals')) {
    return {
      data: {
        success: true,
        data: FALLBACK_PRODUCTS.filter((p) => p.isDeal),
      },
    };
  }

  if (cleanUrl.startsWith('/products/new-arrivals')) {
    return {
      data: {
        success: true,
        data: FALLBACK_PRODUCTS.filter((p) => p.isNewArrival || p.isDeal),
      },
    };
  }

  if (cleanUrl.startsWith('/products/featured')) {
    return {
      data: {
        success: true,
        data: FALLBACK_PRODUCTS.filter((p) => p.isFeatured),
      },
    };
  }

  if (cleanUrl.includes('/related')) {
    return {
      data: {
        success: true,
        data: FALLBACK_PRODUCTS.slice(0, 4),
      },
    };
  }

  if (cleanUrl.includes('/frequently-bought')) {
    return {
      data: {
        success: true,
        data: FALLBACK_PRODUCTS.slice(1, 4),
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

  if (cleanUrl.startsWith('/products/')) {
    const id = cleanUrl.replace('/products/', '').split('/')[0];
    if (
      id !== 'brands' &&
      id !== 'trending' &&
      id !== 'best-sellers' &&
      id !== 'deals' &&
      id !== 'new-arrivals' &&
      id !== 'featured' &&
      id !== 'search'
    ) {
      const product =
        FALLBACK_PRODUCTS.find((p) => p._id === id || p.id === id || p.slug === id) ||
        FALLBACK_PRODUCTS[0];
      return {
        data: {
          success: true,
          data: product,
        },
      };
    }
  }

  if (cleanUrl.startsWith('/products')) {
    let list = [...FALLBACK_PRODUCTS];

    if (params.bestsellers === 'true' || params.isBestSeller === 'true') {
      list = list.filter((p) => p.isBestSeller);
    }
    if (params.deals === 'true' || params.isDeal === 'true') {
      list = list.filter((p) => p.isDeal);
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
        data: list,
        pagination: {
          page: 1,
          limit: 12,
          total: list.length,
          pages: 1,
        },
      },
    };
  }

  // --- ORDERS & ADMIN ---
  if (cleanUrl.startsWith('/orders/stats')) {
    return {
      data: {
        success: true,
        data: {
          totalOrders: 28,
          totalRevenue: 148500,
          pendingOrders: 3,
          totalProducts: 30,
        },
      },
    };
  }

  if (cleanUrl.startsWith('/orders/my') || cleanUrl === '/orders/all' || cleanUrl === '/orders') {
    let storedOrders = [];
    try {
      const raw = localStorage.getItem('nova_mart_orders');
      if (raw) storedOrders = JSON.parse(raw);
    } catch {}
    const combined = [...storedOrders, ...FALLBACK_ORDERS];
    return {
      data: {
        success: true,
        data: combined,
      },
    };
  }

  if (cleanUrl.includes('/status')) {
    const id = cleanUrl.replace('/orders/', '').replace('/status', '').split('/')[0];
    try {
      const stored = JSON.parse(localStorage.getItem('nova_mart_orders') || '[]');
      const updated = stored.map((o) =>
        o._id === id ? { ...o, orderStatus: reqData.orderStatus || 'confirmed' } : o
      );
      localStorage.setItem('nova_mart_orders', JSON.stringify(updated));
    } catch {}
    return {
      data: {
        success: true,
        message: 'Order status updated successfully',
      },
    };
  }

  if (cleanUrl.includes('/invoice')) {
    return {
      data: {
        success: true,
        data: {
          invoiceNumber: 'INV-' + Math.floor(100000 + Math.random() * 900000),
          issueDate: new Date().toLocaleDateString('en-IN'),
          orderNumber: 'ORD-948123',
          company: 'NOVA MART Retail Ltd',
          gstin: '29ABCDE1234F1Z5',
          items: [
            {
              name: FALLBACK_PRODUCTS[0].name,
              qty: 1,
              price: 3749,
            },
          ],
          total: 3749,
        },
      },
    };
  }

  if (cleanUrl.includes('/cancel')) {
    return {
      data: {
        success: true,
        message: 'Order cancelled successfully',
        data: {
          ...FALLBACK_ORDERS[0],
          orderStatus: 'cancelled',
        },
      },
    };
  }

  if (cleanUrl.includes('/reorder')) {
    return {
      data: {
        success: true,
        message: 'Items added back to your cart',
        data: {
          added: ['item_1'],
        },
      },
    };
  }

  if (cleanUrl.startsWith('/orders/')) {
    const id = cleanUrl.replace('/orders/', '').split('/')[0];
    let storedOrders = [];
    try {
      const raw = localStorage.getItem('nova_mart_orders');
      if (raw) storedOrders = JSON.parse(raw);
    } catch {}
    const order = [...storedOrders, ...FALLBACK_ORDERS].find((o) => o._id === id) || FALLBACK_ORDERS[0];
    return {
      data: {
        success: true,
        data: {
          order,
          payment: {
            status: order.paymentStatus || 'completed',
            method: order.paymentMethod || 'cod',
          },
        },
      },
    };
  }

  // --- PAYMENTS & CHECKOUT ---
  if (cleanUrl.startsWith('/payments/create-order')) {
    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      orderStatus: 'confirmed',
      totalPrice: reqData.totalPrice || 2799,
      itemsPrice: reqData.itemsPrice || 2799,
      shippingPrice: reqData.shippingPrice || 0,
      taxPrice: reqData.taxPrice || 140,
      discountPrice: reqData.discountPrice || 0,
      paymentMethod: reqData.paymentMethod || 'cod',
      paymentStatus: reqData.paymentMethod === 'cod' ? 'pending' : 'completed',
      shippingAddress: reqData.shippingAddress || {
        fullName: 'Kiran Kumar',
        phone: '9876543210',
        street: '123 Nova High St, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      items: [
        {
          _id: 'item_' + Date.now(),
          quantity: 1,
          price: 2799,
          product: FALLBACK_PRODUCTS[0],
        },
      ],
      user: {
        _id: 'u_demo',
        firstName: 'Kiran',
        lastName: 'Kumar',
        email: 'customer@novamart.com',
      },
    };

    try {
      const existing = JSON.parse(localStorage.getItem('nova_mart_orders') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('nova_mart_orders', JSON.stringify(existing));
    } catch {}

    return {
      data: {
        success: true,
        data: {
          order: newOrder,
          payment: {
            razorpayOrderId: null,
          },
        },
      },
    };
  }

  if (cleanUrl.startsWith('/payments/verify')) {
    return {
      data: {
        success: true,
        data: {
          order: FALLBACK_ORDERS[0],
        },
      },
    };
  }

  // --- CART & COUPONS ---
  if (cleanUrl.startsWith('/cart/summary')) {
    return {
      data: {
        success: true,
        data: {
          itemsPrice: 2799,
          discountPrice: 0,
          shippingPrice: 0,
          taxPrice: 140,
          totalPrice: 2939,
        },
      },
    };
  }

  if (cleanUrl.startsWith('/cart')) {
    return {
      data: {
        success: true,
        data: {
          items: [],
          savedForLater: [],
          totalItems: 0,
          totalPrice: 0,
        },
      },
    };
  }

  if (cleanUrl.startsWith('/coupons')) {
    return {
      data: {
        success: true,
        data: {
          code: 'NOVA50',
          discount: 50,
          minOrder: 500,
        },
      },
    };
  }

  if (cleanUrl.startsWith('/reviews')) {
    return {
      data: {
        success: true,
        data: [
          {
            _id: 'rev_1',
            user: { name: 'Amit Roy' },
            rating: 5,
            comment: 'Exceptional build quality and sound! Best purchase this year.',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'rev_2',
            user: { name: 'Sneha Patel' },
            rating: 4.5,
            comment: 'Very sleek design and long battery life. Highly recommend.',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    };
  }

  if (cleanUrl.startsWith('/wishlist')) {
    return {
      data: {
        success: true,
        data: [],
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
