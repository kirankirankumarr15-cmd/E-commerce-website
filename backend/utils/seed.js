require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const categories = [
  { name: 'Electronics', description: 'Smart devices and gadgets for modern living', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop', sortOrder: 1 },
  { name: 'Fashion', description: 'Trendy clothing and accessories for every style', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop', sortOrder: 2 },
  { name: 'Home & Living', description: 'Beautiful essentials for your home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', sortOrder: 3 },
  { name: 'Beauty', description: 'Premium skincare and beauty products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop', sortOrder: 4 },
  { name: 'Sports', description: 'Gear up for an active lifestyle', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=600&h=400&fit=crop', sortOrder: 5 },
  { name: 'Books', description: 'Knowledge and stories for curious minds', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop', sortOrder: 6 },
];

const products = [
  {
    name: 'Nova Wireless Earbuds Pro',
    description: 'Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for music lovers and professionals on the go.',
    shortDescription: 'Premium ANC earbuds with 30hr battery',
    price: 4999,
    discount: 20,
    brand: 'Nova Audio',
    stock: 150,
    sku: 'NM-EAR-001',
    rating: 4.7,
    numReviews: 234,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    tags: ['electronics', 'audio', 'wireless'],
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop', alt: 'Nova Wireless Earbuds Pro', type: 'main' },
      { url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop', alt: 'Earbuds side view', type: 'side' },
    ],
    specifications: { 'Battery Life': '30 hours', 'Connectivity': 'Bluetooth 5.3', 'Weight': '5.4g per earbud', 'Water Resistance': 'IPX5' },
  },
  {
    name: 'Smart Watch Series X',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and a stunning AMOLED display. Stay connected and healthy with style.',
    shortDescription: 'Health-focused smartwatch with AMOLED display',
    price: 12999,
    discount: 15,
    brand: 'Nova Tech',
    stock: 80,
    sku: 'NM-WATCH-001',
    rating: 4.5,
    numReviews: 189,
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    tags: ['electronics', 'wearable', 'smartwatch'],
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', alt: 'Smart Watch Series X', type: 'main' },
    ],
    specifications: { 'Display': '1.9" AMOLED', 'Battery': '7 days', 'Water Resistance': '5ATM', 'Sensors': 'Heart rate, SpO2, GPS' },
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with a modern fit. Breathable, durable, and perfect for everyday wear.',
    shortDescription: 'Organic cotton tee with modern fit',
    price: 1299,
    discount: 10,
    brand: 'Nova Wear',
    stock: 300,
    sku: 'NM-TSHIRT-001',
    rating: 4.3,
    numReviews: 456,
    isBestSeller: true,
    tags: ['fashion', 'clothing', 'casual'],
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', alt: 'Premium Cotton T-Shirt', type: 'main' },
    ],
    specifications: { 'Material': '100% Organic Cotton', 'Fit': 'Regular', 'Care': 'Machine wash cold' },
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'Elegant LED desk lamp with adjustable brightness and color temperature. Perfect for work, study, or reading.',
    shortDescription: 'Adjustable LED desk lamp',
    price: 2499,
    discount: 25,
    brand: 'Nova Home',
    stock: 120,
    sku: 'NM-LAMP-001',
    rating: 4.6,
    numReviews: 98,
    isDeal: true,
    isFeatured: true,
    tags: ['home', 'lighting', 'office'],
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop', alt: 'Minimalist Desk Lamp', type: 'main' },
    ],
    specifications: { 'Power': '12W LED', 'Brightness': '5 levels', 'Color Temp': '2700K-6500K' },
  },
  {
    name: 'Hydrating Face Serum',
    description: 'Advanced hydrating serum with hyaluronic acid and vitamin C. Reduces fine lines and gives your skin a radiant glow.',
    shortDescription: 'Hyaluronic acid + Vitamin C serum',
    price: 1899,
    discount: 0,
    brand: 'Nova Beauty',
    stock: 200,
    sku: 'NM-SERUM-001',
    rating: 4.8,
    numReviews: 312,
    isBestSeller: true,
    isNewArrival: true,
    tags: ['beauty', 'skincare', 'serum'],
    images: [
      { url: 'https://images.unsplash.com/photo-1620916565348-6b1c0c0e0b0e?w=800&h=800&fit=crop', alt: 'Hydrating Face Serum', type: 'main' },
    ],
    specifications: { 'Volume': '30ml', 'Key Ingredients': 'Hyaluronic Acid, Vitamin C', 'Skin Type': 'All types' },
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick eco-friendly yoga mat with superior grip and cushioning. Ideal for yoga, pilates, and floor exercises.',
    shortDescription: 'Eco-friendly non-slip yoga mat',
    price: 1999,
    discount: 30,
    brand: 'Nova Fit',
    stock: 175,
    sku: 'NM-YOGA-001',
    rating: 4.4,
    numReviews: 167,
    isDeal: true,
    isTrending: true,
    tags: ['sports', 'fitness', 'yoga'],
    images: [
      { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop', alt: 'Yoga Mat Premium', type: 'main' },
    ],
    specifications: { 'Thickness': '6mm', 'Material': 'TPE Eco-friendly', 'Size': '183 x 61 cm' },
  },
  {
    name: 'Bluetooth Speaker Mini',
    description: 'Compact portable speaker with 360° sound, waterproof design, and 12-hour playtime. Take your music anywhere.',
    shortDescription: 'Portable waterproof Bluetooth speaker',
    price: 3499,
    discount: 18,
    brand: 'Nova Audio',
    stock: 90,
    sku: 'NM-SPK-001',
    rating: 4.5,
    numReviews: 203,
    isTrending: true,
    tags: ['electronics', 'audio', 'speaker'],
    images: [
      { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e3?w=800&h=800&fit=crop', alt: 'Bluetooth Speaker Mini', type: 'main' },
    ],
    specifications: { 'Output': '20W', 'Battery': '12 hours', 'Water Resistance': 'IPX7' },
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Handcrafted genuine leather crossbody bag with multiple compartments. Timeless design meets everyday functionality.',
    shortDescription: 'Genuine leather crossbody bag',
    price: 4499,
    discount: 12,
    brand: 'Nova Wear',
    stock: 60,
    sku: 'NM-BAG-001',
    rating: 4.6,
    numReviews: 89,
    isFeatured: true,
    isNewArrival: true,
    tags: ['fashion', 'accessories', 'bag'],
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d6e38b?w=800&h=800&fit=crop', alt: 'Leather Crossbody Bag', type: 'main' },
    ],
    specifications: { 'Material': 'Genuine Leather', 'Dimensions': '25 x 18 x 8 cm', 'Color': 'Tan Brown' },
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs with a modern matte finish. Microwave and dishwasher safe.',
    shortDescription: 'Set of 4 handcrafted ceramic mugs',
    price: 1599,
    discount: 0,
    brand: 'Nova Home',
    stock: 250,
    sku: 'NM-MUG-001',
    rating: 4.2,
    numReviews: 145,
    isBestSeller: true,
    tags: ['home', 'kitchen', 'mugs'],
    images: [
      { url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop', alt: 'Ceramic Coffee Mug Set', type: 'main' },
    ],
    specifications: { 'Capacity': '350ml each', 'Material': 'Ceramic', 'Set': '4 pieces' },
  },
  {
    name: 'Running Shoes Ultra',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Engineered for peak performance.',
    shortDescription: 'Lightweight performance running shoes',
    price: 5999,
    discount: 22,
    brand: 'Nova Fit',
    stock: 110,
    sku: 'NM-SHOE-001',
    rating: 4.7,
    numReviews: 278,
    isDeal: true,
    isBestSeller: true,
    tags: ['sports', 'footwear', 'running'],
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop', alt: 'Running Shoes Ultra', type: 'main' },
    ],
    specifications: { 'Weight': '240g', 'Drop': '8mm', 'Upper': 'Engineered Mesh' },
  },
  {
    name: 'Bestseller Book Bundle',
    description: 'Curated collection of 3 bestselling books across fiction, self-help, and business. Expand your mind with great reads.',
    shortDescription: '3-book curated bestseller bundle',
    price: 999,
    discount: 15,
    brand: 'Nova Books',
    stock: 400,
    sku: 'NM-BOOK-001',
    rating: 4.9,
    numReviews: 567,
    isFeatured: true,
    isNewArrival: true,
    tags: ['books', 'bundle', 'reading'],
    images: [
      { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop', alt: 'Bestseller Book Bundle', type: 'main' },
    ],
    specifications: { 'Books': '3 titles', 'Format': 'Paperback', 'Language': 'English' },
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    shortDescription: '15W fast wireless charging pad',
    price: 1799,
    discount: 20,
    brand: 'Nova Tech',
    stock: 200,
    sku: 'NM-CHRG-001',
    rating: 4.3,
    numReviews: 134,
    isDeal: true,
    tags: ['electronics', 'charging', 'accessories'],
    images: [
      { url: 'https://images.unsplash.com/photo-1591290619769-2a4d0c12f800?w=800&h=800&fit=crop', alt: 'Wireless Charging Pad', type: 'main' },
    ],
    specifications: { 'Output': '15W', 'Standard': 'Qi Certified', 'Material': 'Aluminum + Glass' },
  },
];

const categoryMap = {
  'Nova Wireless Earbuds Pro': 'Electronics',
  'Smart Watch Series X': 'Electronics',
  'Premium Cotton T-Shirt': 'Fashion',
  'Minimalist Desk Lamp': 'Home & Living',
  'Hydrating Face Serum': 'Beauty',
  'Yoga Mat Premium': 'Sports',
  'Bluetooth Speaker Mini': 'Electronics',
  'Leather Crossbody Bag': 'Fashion',
  'Ceramic Coffee Mug Set': 'Home & Living',
  'Running Shoes Ultra': 'Sports',
  'Bestseller Book Bundle': 'Books',
  'Wireless Charging Pad': 'Electronics',
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nova-mart');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'Nova',
      email: 'admin@novamart.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
    });

    const customer = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'customer@novamart.com',
      password: 'customer123',
      role: 'customer',
      phone: '9876543211',
    });

    const createdCategories = await Category.insertMany(
      categories.map((cat) => ({
        ...cat,
        slug: slugify(cat.name, { lower: true, strict: true }),
      }))
    );
    const catLookup = {};
    createdCategories.forEach((cat) => {
      catLookup[cat.name] = cat._id;
    });

    const productsWithCategory = products.map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true }),
      category: catLookup[categoryMap[p.name]],
      finalPrice: p.price - (p.price * p.discount) / 100,
    }));

    await Product.insertMany(productsWithCategory);

    await Coupon.insertMany([
      { code: 'WELCOME10', description: '10% off your first order', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, maxDiscount: 500, perUserLimit: 1 },
      { code: 'FLAT100', description: '₹100 off on orders above ₹999', discountType: 'fixed', discountValue: 100, minOrderAmount: 999, perUserLimit: 3 },
      { code: 'NOVA20', description: '20% off — limited time', discountType: 'percentage', discountValue: 20, minOrderAmount: 1500, maxDiscount: 1000, usageLimit: 100 },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Admin: admin@novamart.com / admin123`);
    console.log(`Customer: customer@novamart.com / customer123`);
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Coupons: WELCOME10, FLAT100, NOVA20`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
