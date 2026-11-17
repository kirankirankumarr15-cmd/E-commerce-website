"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, ShoppingCart, Package, Menu } from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "You", href: "/account", icon: User },
    { label: "Orders", href: "/orders", icon: Package },
    { label: "Cart", href: "/cart", icon: ShoppingCart, badge: cartCount },
    { label: "Shop", href: "/search", icon: Menu },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#d5d9d9] shadow-lg flex items-center justify-around py-1.5 px-2 select-none"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center relative py-1 px-3 min-w-[56px] transition-colors ${
              isActive ? "text-[#e77600]" : "text-[#565959] hover:text-[#0f1111]"
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5 stroke-[2]" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#cc0c39] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 ${isActive ? "font-bold text-[#e77600]" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
