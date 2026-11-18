"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Calendar,
  Store,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, loginDemo } = useAuth();

  useEffect(() => {
    // No redirect — let the access-denied screen handle it gracefully
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-2" />
          <p className="text-sm text-gray-500">Loading admin console…</p>
        </div>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#eaeded] flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow text-center max-w-md">
          <ShieldAlert className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-gray-900">Access Restricted</h1>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            This area is for Nova Mart operations staff only. Please sign in with an admin account.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => loginDemo("admin")}
              className="w-full rounded-full bg-[#ffd814] px-6 py-2 text-xs font-bold text-gray-900 hover:bg-yellow-400"
            >
              Continue as Demo Admin
            </button>
            <Link href="/" className="block text-xs text-[#007185] hover:underline mt-2">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products Catalog", href: "/admin/products", icon: Package },
    { label: "Orders & Shipments", href: "/admin/orders", icon: ShoppingBag },
    { label: "Delivery Partners", href: "/admin/partners", icon: Truck },
    { label: "Slots & Capacity", href: "/admin/slots", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Operations Header */}
      <header className="border-b border-[#232f3e] bg-[#131921] px-4 py-3 text-white">
        <div className="container-narrow flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-xl font-black text-white">
                nova<span className="text-[#febd69]">mart</span>
              </span>
            </Link>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-[#febd69] border border-amber-500/40">
              Operations & Admin Console
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-300 hover:text-white transition"
            >
              <Store className="h-4 w-4" />
              <span>Customer Storefront</span>
            </Link>
            <Link
              href="/delivery"
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition"
            >
              <Truck className="h-4 w-4" />
              <span>Partner App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="container-narrow py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Admin Sidebar Navigation */}
          <aside className="md:col-span-3 lg:col-span-2">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-3 shadow-xs space-y-1">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "bg-[#131921] text-white shadow-xs"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Admin Main Viewport */}
          <main className="md:col-span-9 lg:col-span-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
