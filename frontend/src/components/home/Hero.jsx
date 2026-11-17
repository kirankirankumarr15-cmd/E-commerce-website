import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Zap, ShieldCheck, Truck } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'The Great Indian Festival',
    highlight: 'Up to 70% Off',
    subtitle: 'Electronics, Smart Devices, Wearables & Daily Essentials',
    badge: 'MEGA SALE',
    cta: 'Explore Deals',
    link: '/shop?deals=true',
    gradient: 'from-[#1a2b49] via-[#0f172a] to-[#232f3e]',
    bgImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=600&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Next-Gen Audio & Smart Tech',
    highlight: 'Nova Earbuds & Wearables',
    subtitle: 'Active noise cancellation, 30h battery life, and crystal audio.',
    badge: 'PRIME SPECIAL',
    cta: 'Shop Now',
    link: '/category/electronics',
    gradient: 'from-[#0b3c5d] via-[#1d2731] to-[#328cc1]',
    bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=600&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'New Season Wardrobe',
    highlight: 'Trending Styles 2026',
    subtitle: 'Premium cotton shirts, jackets, footwear and accessories.',
    badge: 'NEW ARRIVALS',
    cta: 'Discover Fashion',
    link: '/category/fashion',
    gradient: 'from-[#2c3e50] via-[#34495e] to-[#1a252f]',
    bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=600&fit=crop&q=80',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full overflow-hidden select-none bg-[#eaeded]">
      {/* Slides Container */}
      <div className="relative h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px] w-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Overlay */}
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="w-full h-full object-cover object-center brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Slide Content */}
            <div className="container-narrow absolute inset-0 flex flex-col justify-center px-6 sm:px-12 text-white z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#febd69] text-[#131921] font-black text-[11px] sm:text-xs rounded-sm uppercase tracking-wider mb-2 sm:mb-3 w-fit">
                <Zap className="h-3.5 w-3.5 fill-current" />
                {slide.badge}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-1 sm:mb-2 text-white drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-[#febd69] mb-2 sm:mb-3 drop-shadow">
                {slide.highlight}
              </p>
              <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 max-w-lg mb-4 sm:mb-6">
                {slide.subtitle}
              </p>
              <div>
                <Link
                  to={slide.link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold text-xs sm:text-sm shadow-md border border-[#fcd200] transition-colors"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Amazon Gradient Fade to #eaeded */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/80 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === current ? 'w-6 bg-[#febd69]' : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
