export const FALLBACK_CATEGORIES = [
  { _id: 'c1', id: 'c1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&fit=crop' },
  { _id: 'c2', id: 'c2', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&fit=crop' },
  { _id: 'c3', id: 'c3', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&fit=crop' },
  { _id: 'c4', id: 'c4', name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&fit=crop' },
  { _id: 'c5', id: 'c5', name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&fit=crop' },
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
  {
    _id: 'p7',
    id: 'p7',
    name: 'Nova ClearBass Ergonomic ANC Wireless Headphones',
    title: 'Nova ClearBass Ergonomic ANC Wireless Headphones',
    slug: 'nova-clearbass-anc-wireless-headphones',
    description: 'Custom 40mm dynamic drivers, hybrid active noise cancellation up to 40dB, 50-hour battery life, and ultra-plush memory foam earpads.',
    price: 6999,
    discount: 30,
    finalPrice: 4899,
    final_price: 4899,
    category: { _id: 'c1', name: 'Electronics', slug: 'electronics' },
    category_slug: 'electronics',
    brand: 'Nova Audio',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop', type: 'main' }],
    stock: 55,
    rating: 4.9,
    numReviews: 388,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p8',
    id: 'p8',
    name: 'UltraView 4K Magnetic WebCam with Stereo Mic',
    title: 'UltraView 4K Magnetic WebCam with Stereo Mic',
    slug: 'ultraview-4k-magnetic-webcam',
    description: 'Crystal-clear 4K Ultra HD video conferencing sensor with dual noise-cancelling microphones, magnetic mount, and physical privacy shutter.',
    price: 3499,
    discount: 20,
    finalPrice: 2799,
    final_price: 2799,
    category: { _id: 'c1', name: 'Electronics', slug: 'electronics' },
    category_slug: 'electronics',
    brand: 'Apex Tech',
    images: [{ url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&fit=crop', type: 'main' }],
    stock: 95,
    rating: 4.6,
    numReviews: 142,
    isDeal: false,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    isTrending: true,
  },
  {
    _id: 'p9',
    id: 'p9',
    name: 'Aura Handcrafted Full-Grain Leather Messenger Bag',
    title: 'Aura Handcrafted Full-Grain Leather Messenger Bag',
    slug: 'aura-handcrafted-leather-messenger-bag',
    description: '100% genuine vintage top-grain leather with antique brass hardware, padded 15.6-inch laptop compartment, and adjustable shoulder strap.',
    price: 4999,
    discount: 25,
    finalPrice: 3749,
    final_price: 3749,
    category: { _id: 'c2', name: 'Fashion', slug: 'fashion' },
    category_slug: 'fashion',
    brand: 'Aura Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d6e38b?w=800&fit=crop', type: 'main' }],
    stock: 40,
    rating: 4.8,
    numReviews: 164,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p10',
    id: 'p10',
    name: 'Aura Classic Polarized Aviator Sunglasses (UV400)',
    title: 'Aura Classic Polarized Aviator Sunglasses (UV400)',
    slug: 'aura-classic-polarized-aviator-sunglasses',
    description: 'Military-grade lightweight titanium alloy frame with scratch-resistant 9-layer polarized lenses offering 100% UV400 eye protection.',
    price: 1999,
    discount: 35,
    finalPrice: 1299,
    final_price: 1299,
    category: { _id: 'c2', name: 'Fashion', slug: 'fashion' },
    category_slug: 'fashion',
    brand: 'Aura Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&fit=crop', type: 'main' }],
    stock: 130,
    rating: 4.7,
    numReviews: 247,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    _id: 'p11',
    id: 'p11',
    name: 'Nomad Water-Resistant Commuter Backpack 28L',
    title: 'Nomad Water-Resistant Commuter Backpack 28L',
    slug: 'nomad-water-resistant-commuter-backpack',
    description: 'High-density ballistic waterproof nylon with hidden anti-theft RFID pocket, external USB port, and breathable ergonomic airflow back panel.',
    price: 2999,
    discount: 20,
    finalPrice: 2399,
    final_price: 2399,
    category: { _id: 'c2', name: 'Fashion', slug: 'fashion' },
    category_slug: 'fashion',
    brand: 'Aura Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&fit=crop', type: 'main' }],
    stock: 80,
    rating: 4.6,
    numReviews: 215,
    isDeal: false,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    isTrending: false,
  },
  {
    _id: 'p12',
    id: 'p12',
    name: 'Lumina Minimalist Touch-Control LED Desk Lamp',
    title: 'Lumina Minimalist Touch-Control LED Desk Lamp',
    slug: 'lumina-minimalist-touch-led-desk-lamp',
    description: 'Sleek architectural LED study lamp with 5 color temperatures, stepless touch dimming, 45-minute auto-timer, and integrated wireless charging base.',
    price: 2499,
    discount: 20,
    finalPrice: 1999,
    final_price: 1999,
    category: { _id: 'c3', name: 'Home & Living', slug: 'home-living' },
    category_slug: 'home-living',
    brand: 'Nova Home',
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&fit=crop', type: 'main' }],
    stock: 110,
    rating: 4.8,
    numReviews: 182,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p13',
    id: 'p13',
    name: 'AromaMist Ultrasonic Essential Oil Diffuser 500ml',
    title: 'AromaMist Ultrasonic Essential Oil Diffuser 500ml',
    slug: 'aromamist-ultrasonic-essential-oil-diffuser',
    description: '500ml capacity ultrasonic aromatherapy diffuser and cool-mist humidifier with 7 ambient soothing LED colors and whisper-quiet 20dB operation.',
    price: 1999,
    discount: 25,
    finalPrice: 1499,
    final_price: 1499,
    category: { _id: 'c3', name: 'Home & Living', slug: 'home-living' },
    category_slug: 'home-living',
    brand: 'Nova Home',
    images: [{ url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&fit=crop', type: 'main' }],
    stock: 140,
    rating: 4.7,
    numReviews: 295,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    _id: 'p14',
    id: 'p14',
    name: 'Artisan Hand-Glazed Ceramic Coffee Mug Set (4-Pack)',
    title: 'Artisan Hand-Glazed Ceramic Coffee Mug Set (4-Pack)',
    slug: 'artisan-hand-glazed-ceramic-coffee-mug-set',
    description: 'Set of 4 heavy-base handcrafted ceramic 380ml mugs in modern earth-tone matte glazes. Microwave and dishwasher safe.',
    price: 1499,
    discount: 15,
    finalPrice: 1274,
    final_price: 1274,
    category: { _id: 'c3', name: 'Home & Living', slug: 'home-living' },
    category_slug: 'home-living',
    brand: 'Nova Home',
    images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&fit=crop', type: 'main' }],
    stock: 90,
    rating: 4.5,
    numReviews: 128,
    isDeal: false,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    isTrending: false,
  },
  {
    _id: 'p15',
    id: 'p15',
    name: 'ErgoRest Memory Foam Ergonomic Cervical Contour Pillow',
    title: 'ErgoRest Memory Foam Ergonomic Cervical Contour Pillow',
    slug: 'ergorest-memory-foam-contour-pillow',
    description: 'Therapeutic orthopedic neck support pillow engineered with high-density slow-rebound memory foam and washable cooling bamboo fiber cover.',
    price: 2299,
    discount: 30,
    finalPrice: 1609,
    final_price: 1609,
    category: { _id: 'c3', name: 'Home & Living', slug: 'home-living' },
    category_slug: 'home-living',
    brand: 'Nova Home',
    images: [{ url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&fit=crop', type: 'main' }],
    stock: 65,
    rating: 4.9,
    numReviews: 310,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p16',
    id: 'p16',
    name: 'GlowBotanica 20% Vitamin C + Hyaluronic Acid Brightening Serum',
    title: 'GlowBotanica 20% Vitamin C + Hyaluronic Acid Brightening Serum',
    slug: 'glowbotanica-vitamin-c-hyaluronic-acid-serum',
    description: 'Clinical grade 20% pure L-Ascorbic Acid serum infused with multi-molecular hyaluronic acid and ferulic acid for radiant glowing skin.',
    price: 1299,
    discount: 20,
    finalPrice: 1039,
    final_price: 1039,
    category: { _id: 'c4', name: 'Beauty', slug: 'beauty' },
    category_slug: 'beauty',
    brand: 'PureGlow',
    images: [{ url: 'https://images.unsplash.com/photo-1620916565348-6b1c0c0e0b0e?w=800&fit=crop', type: 'main' }],
    stock: 180,
    rating: 4.8,
    numReviews: 440,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p17',
    id: 'p17',
    name: 'DermaShield Invisible Gel Sunscreen SPF 50+ PA++++ (50g)',
    title: 'DermaShield Invisible Gel Sunscreen SPF 50+ PA++++ (50g)',
    slug: 'dermashield-invisible-gel-sunscreen-spf-50',
    description: 'Ultra-lightweight invisible water-gel sunscreen with zero white cast, broad spectrum UV filters, antioxidant Vitamin E, and 80-minute sweat resistance.',
    price: 899,
    discount: 15,
    finalPrice: 764,
    final_price: 764,
    category: { _id: 'c4', name: 'Beauty', slug: 'beauty' },
    category_slug: 'beauty',
    brand: 'PureGlow',
    images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&fit=crop', type: 'main' }],
    stock: 220,
    rating: 4.7,
    numReviews: 382,
    isDeal: false,
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: false,
    isTrending: true,
  },
  {
    _id: 'p18',
    id: 'p18',
    name: 'NutriSilks 100% Pure Moroccan Cold-Pressed Argan Oil (100ml)',
    title: 'NutriSilks 100% Pure Moroccan Cold-Pressed Argan Oil (100ml)',
    slug: 'nutrisilks-pure-moroccan-argan-oil',
    description: 'USDA certified organic virgin cold-pressed Moroccan argan oil for silky frizz-free hair, split-end repair, and intensive skin hydration.',
    price: 1599,
    discount: 25,
    finalPrice: 1199,
    final_price: 1199,
    category: { _id: 'c4', name: 'Beauty', slug: 'beauty' },
    category_slug: 'beauty',
    brand: 'PureGlow',
    images: [{ url: 'https://images.unsplash.com/photo-1608248597359-bb4f4d2f6233?w=800&fit=crop', type: 'main' }],
    stock: 95,
    rating: 4.6,
    numReviews: 175,
    isDeal: true,
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: true,
    isTrending: false,
  },
  {
    _id: 'p19',
    id: 'p19',
    name: 'FlexPro Non-Slip Extra-Thick Dual-Layer TPE Yoga Mat (8mm)',
    title: 'FlexPro Non-Slip Extra-Thick Dual-Layer TPE Yoga Mat (8mm)',
    slug: 'flexpro-non-slip-tpe-yoga-mat-8mm',
    description: 'Eco-friendly biodegradable TPE workout mat with body alignment position markers, dual-sided textured grip, joint-cushioning 8mm thickness, and shoulder strap.',
    price: 1899,
    discount: 25,
    finalPrice: 1424,
    final_price: 1424,
    category: { _id: 'c5', name: 'Sports', slug: 'sports' },
    category_slug: 'sports',
    brand: 'IronCore',
    images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&fit=crop', type: 'main' }],
    stock: 125,
    rating: 4.8,
    numReviews: 290,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p20',
    id: 'p20',
    name: 'AeroStride Carbon-Plate Lightweight Running Shoes',
    title: 'AeroStride Carbon-Plate Lightweight Running Shoes',
    slug: 'aerostride-carbon-plate-running-shoes',
    description: 'Professional marathon running shoes with embedded full-length carbon propulsion plate, nitrogen-infused supercritical midsole, and breathable warp knit upper.',
    price: 4999,
    discount: 20,
    finalPrice: 3999,
    final_price: 3999,
    category: { _id: 'c5', name: 'Sports', slug: 'sports' },
    category_slug: 'sports',
    brand: 'IronCore',
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop', type: 'main' }],
    stock: 75,
    rating: 4.7,
    numReviews: 210,
    isDeal: false,
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p21',
    id: 'p21',
    name: 'HydroChug Vacuum Insulated Stainless Steel Flask (1000ml)',
    title: 'HydroChug Vacuum Insulated Stainless Steel Flask (1000ml)',
    slug: 'hydrochug-vacuum-insulated-stainless-flask-1000ml',
    description: 'Double-walled vacuum insulated 18/8 kitchen-grade stainless steel bottle. Keeps drinks icy cold for 24 hours or steaming hot for 12 hours.',
    price: 1299,
    discount: 20,
    finalPrice: 1039,
    final_price: 1039,
    category: { _id: 'c5', name: 'Sports', slug: 'sports' },
    category_slug: 'sports',
    brand: 'IronCore',
    images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&fit=crop', type: 'main' }],
    stock: 210,
    rating: 4.9,
    numReviews: 520,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: false,
    isTrending: true,
  },
  {
    _id: 'p22',
    id: 'p22',
    name: 'IronCore Adjustable Quick-Lock Dumbbells Set (20kg Pair)',
    title: 'IronCore Adjustable Quick-Lock Dumbbells Set (20kg Pair)',
    slug: 'ironcore-adjustable-quick-lock-dumbbells-20kg',
    description: 'Rapid 1-second dial adjustment from 2.5kg to 20kg per dumbbell. Heavy-duty cast iron weight plates with anti-scratch silicone coated cradle.',
    price: 7999,
    discount: 30,
    finalPrice: 5599,
    final_price: 5599,
    category: { _id: 'c5', name: 'Sports', slug: 'sports' },
    category_slug: 'sports',
    brand: 'IronCore',
    images: [{ url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&fit=crop', type: 'main' }],
    stock: 35,
    rating: 4.8,
    numReviews: 184,
    isDeal: true,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: true,
    isTrending: false,
  },
  {
    _id: 'p23',
    id: 'p23',
    name: 'The High-Performance Habit & Mindset Bestseller Trilogy',
    title: 'The High-Performance Habit & Mindset Bestseller Trilogy',
    slug: 'high-performance-habit-mindset-bestseller-trilogy',
    description: '3-book international bestseller collector box set covering atomic habits, deep cognitive focus, and peak psychology. Deluxe hardcover edition with gold foil stamping.',
    price: 1499,
    discount: 25,
    finalPrice: 1124,
    final_price: 1124,
    category: { _id: 'c6', name: 'Books', slug: 'books' },
    category_slug: 'books',
    brand: 'Nova Publishing',
    images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&fit=crop', type: 'main' }],
    stock: 160,
    rating: 4.9,
    numReviews: 610,
    isDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    isTrending: true,
  },
  {
    _id: 'p24',
    id: 'p24',
    name: 'Masterpiece Leather-Bound Dotted Bullet Journal & Pen Box',
    title: 'Masterpiece Leather-Bound Dotted Bullet Journal & Pen Box',
    slug: 'masterpiece-leather-bullet-journal-pen-box',
    description: 'Premium vegan leather notebook with 160 GSM ultra-thick bleed-proof ivory paper, expand pocket, dual ribbon bookmarks, and weighted brass ballpoint pen.',
    price: 1199,
    discount: 20,
    finalPrice: 959,
    final_price: 959,
    category: { _id: 'c6', name: 'Books', slug: 'books' },
    category_slug: 'books',
    brand: 'Nova Publishing',
    images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&fit=crop', type: 'main' }],
    stock: 120,
    rating: 4.7,
    numReviews: 235,
    isDeal: false,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    isTrending: true,
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

const memoryStore = {};
const safeStorage = {
  getItem: (k) => {
    try {
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(k);
        if (val !== null) return val;
      }
    } catch {}
    return memoryStore[k] || null;
  },
  setItem: (k, v) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(k, v);
      }
    } catch {}
    memoryStore[k] = String(v);
  },
};

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
    const email = reqData.email || params.email || safeStorage.getItem('nova_user_email') || 'customer@novamart.com';
    const isAdmin = email.includes('admin') || safeStorage.getItem('nova_demo_role') === 'admin';
    const firstName = reqData.firstName || (isAdmin ? 'Admin' : 'Kiran');
    const lastName = reqData.lastName || (isAdmin ? 'User' : 'Kumar');
    const fullName = reqData.name || `${firstName} ${lastName}`.trim();
    const phone = reqData.phone || '9876543210';

    const mockUser = {
      _id: 'u_demo_' + (isAdmin ? 'admin' : 'cust'),
      firstName: firstName,
      lastName: lastName,
      name: fullName,
      email: email,
      role: isAdmin ? 'admin' : 'customer',
      phone: phone,
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
        data: ['Nova Audio', 'Apex Tech', 'VoltStream', 'Aura Cotton', 'Aura Fashion', 'Nova Home', 'PureGlow', 'IronCore', 'Nova Publishing'],
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
      const raw = safeStorage.getItem('nova_mart_orders');
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
      const stored = JSON.parse(safeStorage.getItem('nova_mart_orders') || '[]');
      const updated = stored.map((o) =>
        o._id === id ? { ...o, orderStatus: reqData.orderStatus || 'confirmed' } : o
      );
      safeStorage.setItem('nova_mart_orders', JSON.stringify(updated));
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
      const raw = safeStorage.getItem('nova_mart_orders');
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
      const existing = JSON.parse(safeStorage.getItem('nova_mart_orders') || '[]');
      existing.unshift(newOrder);
      safeStorage.setItem('nova_mart_orders', JSON.stringify(existing));
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
    let cartData = { items: [], savedForLater: [], totalItems: 0, totalPrice: 0 };
    try {
      const raw = safeStorage.getItem('nova_mart_guest_cart');
      if (raw) cartData = JSON.parse(raw);
    } catch {}

    // Support adding items via mock fallback
    if (reqData && (reqData.productId || reqData.product)) {
      const prodId = reqData.productId || reqData.product;
      const product =
        FALLBACK_PRODUCTS.find((p) => p._id === prodId || p.id === prodId || p.slug === prodId) ||
        FALLBACK_PRODUCTS[0];
      const quantity = Number(reqData.quantity) || 1;
      const existing = cartData.items?.find((i) => i.product?._id === product._id || i.product?.id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        if (!cartData.items) cartData.items = [];
        cartData.items.push({
          _id: 'ci_' + Date.now(),
          product,
          quantity,
          price: product.finalPrice || product.price,
        });
      }
      cartData.totalItems = cartData.items.reduce((s, i) => s + i.quantity, 0);
      cartData.totalPrice = cartData.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
      safeStorage.setItem('nova_mart_guest_cart', JSON.stringify(cartData));
    }

    const itemsPrice = cartData.totalPrice || 0;
    const shippingPrice = itemsPrice >= 999 || itemsPrice === 0 ? 0 : 49;
    const taxPrice = Math.round(itemsPrice * 0.18);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
      data: {
        success: true,
        data: cartData,
        pricing: {
          itemsPrice,
          discountPrice: 0,
          shippingPrice,
          taxPrice,
          totalPrice,
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
