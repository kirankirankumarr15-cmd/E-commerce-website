import Link from "next/link";
import { Zap, Clock, Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dealsRes, bestSellersRes, trendingRes, categories] = await Promise.all([
    getProducts({ isDeal: true, limit: 4 }),
    getProducts({ isBestSeller: true, limit: 4 }),
    getProducts({ isTrending: true, limit: 4 }),
    getCategories(),
  ]);

  const deals = dealsRes.products;
  const bestSellers = bestSellersRes.products;
  const trending = trendingRes.products;

  return (
    <div className="bg-[#eaeded] min-h-screen pb-12">
      {/* 1. Amazon Hero Banner */}
      <HeroCarousel />

      {/* 2. Amazon 4-Quad Card Grid */}
      <div className="container-narrow relative z-20 -mt-6 sm:-mt-12 md:-mt-16 lg:-mt-20 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Electronics */}
          <div className="bg-white p-4 rounded-md shadow-xs border border-[#e0e0e0] flex flex-col justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-3 leading-snug">
                Up to 60% off | Top tech & gadgets
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link href="/search?category=electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop"
                      alt="Earbuds"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Wireless Audio</span>
                </Link>
                <Link href="/search?category=electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
                      alt="Smart Watches"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Smartwatches</span>
                </Link>
                <Link href="/search?category=electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop"
                      alt="Fitness Bands"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Wearables</span>
                </Link>
                <Link href="/search?category=electronics" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop"
                      alt="Accessories"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Fast Chargers</span>
                </Link>
              </div>
            </div>
            <Link href="/search?category=electronics" className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline">
              See more deals
            </Link>
          </div>

          {/* Card 2: Fashion */}
          <div className="bg-white p-4 rounded-md shadow-xs border border-[#e0e0e0] flex flex-col justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-3 leading-snug">
                Revamp your style | Trending fashion
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link href="/search?category=fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop"
                      alt="Shirts"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Men&apos;s Shirts</span>
                </Link>
                <Link href="/search?category=fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop"
                      alt="Jackets"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Jackets & Coats</span>
                </Link>
                <Link href="/search?category=fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop"
                      alt="Wallets"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Leather Wallets</span>
                </Link>
                <Link href="/search?category=fashion" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
                      alt="Backpacks"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Bags & Luggage</span>
                </Link>
              </div>
            </div>
            <Link href="/search?category=fashion" className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline">
              Explore fashion sale
            </Link>
          </div>

          {/* Card 3: Home & Living */}
          <div className="bg-white p-4 rounded-md shadow-xs border border-[#e0e0e0] flex flex-col justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-3 leading-snug">
                Home Essentials | Up to 50% off
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link href="/search?category=home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
                      alt="Bedsheet"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Cotton Bedding</span>
                </Link>
                <Link href="/search?category=home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=300&h=300&fit=crop"
                      alt="Cookware"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Cast Iron Skillet</span>
                </Link>
                <Link href="/search?category=home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop"
                      alt="Lighting"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Desk Lighting</span>
                </Link>
                <Link href="/search?category=home-living" className="group">
                  <div className="aspect-square bg-[#f7fafa] rounded overflow-hidden flex items-center justify-center p-2 border border-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop"
                      alt="Coffee"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] text-[#0f1111] font-medium block mt-1 truncate">Coffee Brewers</span>
                </Link>
              </div>
            </div>
            <Link href="/search?category=home-living" className="text-xs font-medium text-[#007185] hover:text-[#c7511f] hover:underline">
              Shop home collection
            </Link>
          </div>

          {/* Card 4: Signature Scheduled Delivery Box */}
          <div className="bg-white p-4 rounded-md shadow-xs border border-[#e0e0e0] flex flex-col justify-between">
            <div>
              <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider mb-2 inline-block">
                SIGNATURE FEATURE
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0f1111] mb-2 leading-snug">
                Scheduled 2-Hour Handover Slots
              </h2>
              <p className="text-xs text-[#565959] mb-3 leading-relaxed">
                Pick your date and 2-hour window. The partner arrives on time and hands over with your secret 4-digit code.
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 p-2 bg-[#f0f8ff] rounded border border-[#b8daff] text-xs text-[#004085]">
                  <Clock className="h-4 w-4 shrink-0 text-[#007185]" />
                  <span>Choose slot during checkout</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#e8f5e9] rounded border border-[#c8e6c9] text-xs text-[#1b5e20]">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#007600]" />
                  <span>Secure 4-digit handover OTP</span>
                </div>
              </div>
            </div>
            <Link
              href="/orders"
              className="block w-full py-2 px-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold text-xs text-center border border-[#fcd200] shadow-xs"
            >
              View Active Scheduled Orders
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Today's Deals Rail */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-xs border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3 w-3 fill-current" /> Deals
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f1111]">
                Today&apos;s Lightning Deals
              </h2>
            </div>
            <Link href="/search?deals=true" className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline">
              See all deals
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Best Sellers Rail */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-xs border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e67a00]">Top Ranked</span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f1111]">
                Best Sellers in Store
              </h2>
            </div>
            <Link href="/search?bestsellers=true" className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline">
              View all best sellers
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Amazon Fast Delivery Banner */}
      <div className="container-narrow mb-6">
        <div className="bg-gradient-to-r from-[#002f36] via-[#004f5a] to-[#007185] text-white p-6 rounded-md shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6 text-[#febd69]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black italic tracking-tight text-[#00a8e1]">prime</span>
                <span className="bg-[#febd69] text-[#131921] text-[10px] font-black px-1.5 py-0.5 rounded-xs uppercase">
                  Fast & Scheduled
                </span>
              </div>
              <p className="text-sm text-neutral-100">
                Enjoy Free Next-Day Delivery & Scheduled 2-Hour Handover Slots with verified delivery codes.
              </p>
            </div>
          </div>
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-full bg-[#febd69] hover:bg-[#f3a847] text-[#131921] font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-xs"
          >
            Shop All Products
          </Link>
        </div>
      </div>

      {/* 6. Trending Products */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-xs border border-[#e0e0e0]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Popular</span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f1111]">
                Trending Right Now
              </h2>
            </div>
            <Link href="/search?sort=popular" className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline">
              Explore more
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* 7. Explore Categories */}
      <div className="container-narrow mb-6">
        <div className="bg-white p-4 sm:p-5 rounded-md shadow-xs border border-[#e0e0e0]">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f1111] mb-4 pb-2 border-b border-neutral-100">
            Explore All Departments
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="group block bg-[#f7fafa] hover:bg-white rounded border border-neutral-200 hover:border-neutral-400 p-3 text-center transition-all"
              >
                <div className="aspect-square rounded overflow-hidden flex items-center justify-center p-2 mb-2 bg-white border border-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs font-bold text-[#0f1111] group-hover:text-[#c7511f] line-clamp-1">
                  {cat.name}
                </p>
                <span className="text-[11px] text-[#007185] group-hover:underline">Shop now</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Amazon Trust Badges */}
      <div className="container-narrow">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <Truck className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">Free Delivery</p>
              <p className="text-[11px] text-[#565959]">On all orders above ₹499</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <RotateCcw className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">7 Days Replacement</p>
              <p className="text-[11px] text-[#565959]">Hassle-free returns</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">100% Secure Checkout</p>
              <p className="text-[11px] text-[#565959]">UPI, Cards, Cash on Delivery</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-[#e0e0e0] flex items-center gap-3">
            <Clock className="h-7 w-7 text-[#007185] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#0f1111]">Scheduled Slots</p>
              <p className="text-[11px] text-[#565959]">4-digit OTP handover</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
