import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { CartProvider } from "@/lib/cartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "NOVA MART — Online Shopping Store with Scheduled Delivery",
  description: "Shop electronics, fashion, home essentials, books and more with 2-hour scheduled handover delivery slots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#eaeded] text-[#0f1111] min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
