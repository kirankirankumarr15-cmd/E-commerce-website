"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "The Great Indian Festival",
    highlight: "Up to 70% Off on Top Brands",
    subtitle: "Electronics, Wearables, Fashion & Home with Guaranteed 2-Hour Delivery Slots",
    badge: "FESTIVAL SPECIAL",
    cta: "Explore Lightning Deals",
    link: "/search?deals=true",
    bgImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=700&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Next-Gen Audio & Smart Tech",
    highlight: "Active Noise Cancellation & AMOLED Watches",
    subtitle: "Studio crystal audio, multi-day battery life, and scheduled handover at your door.",
    badge: "PRIME DEALS",
    cta: "Shop Electronics",
    link: "/search?category=electronics",
    bgImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=700&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Upgrade Your Style & Living",
    highlight: "Curated Cotton Apparel & Modern Home Essentials",
    subtitle: "Premium organic fabrics, cookware, bedding and smart workspace lighting.",
    badge: "TRENDING NOW",
    cta: "Shop Fashion & Home",
    link: "/search?category=fashion",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=700&fit=crop&q=80",
  },
];

export default function HeroCarousel() {
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
      {/* Generous responsive banner height so text and button are never clipped */}
      <div className="relative h-[360px] sm:h-[420px] md:h-[500px] lg:h-[560px] xl:h-[620px] w-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with dark overlay */}
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="w-full h-full object-cover object-center brightness-70"
            />
            {/* Multi-stage dark gradient for maximum text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />

            {/* Slide Content positioned at top/middle so cards below never overlap the button */}
            <div className="container-narrow absolute inset-0 flex flex-col justify-start pt-8 sm:pt-12 md:pt-16 lg:pt-20 px-6 sm:px-14 lg:px-16 text-white z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#febd69] text-[#131921] font-extrabold text-[11px] sm:text-xs rounded-sm uppercase tracking-wider mb-2.5 w-fit shadow-sm">
                <Zap className="h-3.5 w-3.5 fill-current" />
                {slide.badge}
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {slide.title}
              </h1>

              <p className="mt-1 text-base sm:text-2xl md:text-3xl font-extrabold text-[#febd69] drop-shadow">
                {slide.highlight}
              </p>

              <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 max-w-xl drop-shadow">
                {slide.subtitle}
              </p>

              <div className="mt-4 sm:mt-6">
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold text-xs sm:text-sm shadow-lg border border-[#fcd200] transition transform hover:scale-[1.02] active:scale-95"
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
          className="absolute left-2 sm:left-4 top-1/3 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer border border-white/20 backdrop-blur-xs"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/3 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer border border-white/20 backdrop-blur-xs"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Bottom smooth gradient transition to page background #eaeded */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/85 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === current ? "w-6 bg-[#febd69]" : "w-2 bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
