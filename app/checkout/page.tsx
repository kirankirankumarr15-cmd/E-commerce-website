"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Truck,
  Plus,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import SlotPicker from "@/components/SlotPicker";
import { createOrder } from "@/lib/orders";
import { fmtDate, fmtTime } from "@/lib/config";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemsPrice, shippingPrice, totalPrice, clearCart } = useCart();
  const { user, addresses, addAddress } = useAuth();

  // Accordion Step State: 1 = Address, 2 = Slot, 3 = Payment, 4 = Review
  const [activeStep, setActiveStep] = useState<number>(1);

  // Step 1: Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || "default"
  );
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Bangalore");
  const [newState, setNewState] = useState("Karnataka");
  const [newPincode, setNewPincode] = useState("560103");

  const currentAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  // Step 2: Scheduled Delivery Slot
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    start: string;
    end: string;
  } | null>(null);

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // Step 4: Submission State
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newStreet || !newPincode) return;
    addAddress({
      fullName: newFullName,
      phone: newPhone,
      street: newStreet,
      city: newCity,
      state: newState,
      pincode: newPincode,
    });
    setShowNewAddressModal(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedSlot) {
      setOrderError("Please select a 2-hour delivery slot before placing your order.");
      setActiveStep(2);
      return;
    }

    if (items.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    setOrderError("");

    try {
      const res = await createOrder({
        userId: user?.id || "demo-cust-001",
        name: currentAddress.fullName,
        phone: currentAddress.phone,
        email: user?.email || "customer@novamart.in",
        address: `${currentAddress.street}, ${currentAddress.city}, ${currentAddress.state}`,
        pincode: currentAddress.pincode,
        slotDate: selectedSlot.date,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        totalAmount: totalPrice,
        paymentMethod,
        items,
      });

      if (!res.ok) {
        setOrderError(res.error || "Failed to place order.");
        setPlacingOrder(false);
        return;
      }

      // Clear cart
      clearCart();

      // Navigate to order details page with the secret 4-digit code!
      router.push(`/orders/${res.orderId}`);
    } catch (err: any) {
      setOrderError(err.message || "An unexpected error occurred.");
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#eaeded] min-h-screen py-16 text-center">
        <div className="container-narrow max-w-md mx-auto bg-white p-8 rounded-lg shadow-xs">
          <h1 className="text-xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-xs text-gray-500">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-[#ffd814] px-6 py-2.5 text-xs font-bold text-gray-900 hover:bg-yellow-400"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      {/* Checkout Minimal Top Header */}
      <header className="border-b border-gray-200 bg-white py-3 px-4 shadow-2xs">
        <div className="container-narrow flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#131921]">
              nova<span className="text-[#febd69]">mart</span>
            </span>
          </Link>

          <h1 className="text-base sm:text-xl font-medium text-gray-800">
            Checkout (
            <span className="text-amber-700 font-bold">
              {items.reduce((s, i) => s + i.quantity, 0)} items
            </span>
            )
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="hidden sm:inline">256-Bit SSL Encryption</span>
          </div>
        </div>
      </header>

      <div className="container-narrow py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 4-Step Accordion Section (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* STEP 1: DELIVERY ADDRESS */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div
                onClick={() => setActiveStep(1)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/70 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    1
                  </span>
                  <h2 className="text-base font-bold text-gray-900">
                    Select Delivery Address
                  </h2>
                </div>
                {activeStep !== 1 && currentAddress && (
                  <div className="text-xs text-gray-600 text-right truncate max-w-xs sm:max-w-md">
                    <span className="font-semibold text-gray-900">
                      {currentAddress.fullName}
                    </span>
                    : {currentAddress.street}, {currentAddress.city} - {currentAddress.pincode}
                  </div>
                )}
              </div>

              {activeStep === 1 && (
                <div className="border-t border-gray-200 p-5 bg-white space-y-4">
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition ${
                          selectedAddressId === addr.id
                            ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-amber-500 focus:ring-amber-500"
                        />
                        <div className="text-xs text-gray-800 space-y-1">
                          <p className="font-bold text-sm text-gray-900">
                            {addr.fullName}{" "}
                            <span className="font-normal text-xs text-gray-500">
                              ({addr.phone})
                            </span>
                          </p>
                          <p className="text-gray-700">
                            {addr.street}, {addr.city}, {addr.state} -{" "}
                            <span className="font-semibold text-gray-900">
                              {addr.pincode}
                            </span>
                          </p>
                          {addr.isDefault && (
                            <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                              Default Address
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressModal(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline"
                    >
                      <Plus className="h-4 w-4" />
                      Add a new delivery address
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="rounded-full bg-[#ffd814] px-6 py-2 text-xs font-bold text-gray-900 hover:bg-yellow-400 shadow-xs"
                    >
                      Use this address
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: CHOOSE DELIVERY TIME (THE SIGNATURE SCHEDULED DELIVERY MODULE) */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div
                onClick={() => setActiveStep(2)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/70 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    2
                  </span>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-gray-900">
                      Choose Delivery Time (Scheduled Slot)
                    </h2>
                    <span className="hidden sm:inline rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      Signature Feature
                    </span>
                  </div>
                </div>
                {activeStep !== 2 && selectedSlot && (
                  <div className="text-xs font-bold text-green-700 text-right">
                    {fmtDate(selectedSlot.date)}, {fmtTime(selectedSlot.start)} – {fmtTime(selectedSlot.end)}
                  </div>
                )}
              </div>

              {activeStep === 2 && (
                <div className="border-t border-gray-200 p-5 bg-white space-y-4">
                  <div className="rounded-md bg-blue-50/60 border border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-bold">Scheduled 2-Hour Handover Window</span>
                      <p className="text-[11px] text-blue-800 mt-0.5">
                        Our delivery partner arrives during this exact window and hands over your package using your secret 4-digit code.
                      </p>
                    </div>
                  </div>

                  {/* SlotPicker Embedded Component */}
                  <SlotPicker
                    pincode={currentAddress.pincode}
                    selectedSlot={selectedSlot}
                    onSelectSlot={(slot) => {
                      setSelectedSlot(slot);
                    }}
                  />

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={!selectedSlot}
                      onClick={() => setActiveStep(3)}
                      className="rounded-full bg-[#ffd814] px-6 py-2 text-xs font-bold text-gray-900 hover:bg-yellow-400 shadow-xs disabled:opacity-40"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div
                onClick={() => setActiveStep(3)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/70 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    3
                  </span>
                  <h2 className="text-base font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>
                {activeStep !== 3 && (
                  <div className="text-xs font-semibold text-gray-700">
                    {paymentMethod === "cod" ? "Pay on Delivery (Cash/UPI)" : "Online / Razorpay (Test Mode)"}
                  </div>
                )}
              </div>

              {activeStep === 3 && (
                <div className="border-t border-gray-200 p-5 bg-white space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-gray-900 block">
                        Pay on Delivery (Cash / UPI)
                      </span>
                      <span className="text-xs text-gray-600">
                        Pay cash or scan QR code via UPI when the partner arrives with your package.
                      </span>
                    </div>
                  </label>

                  {/* Online / Razorpay */}
                  <label
                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition ${
                      paymentMethod === "online"
                        ? "border-amber-600 bg-amber-50/30 ring-1 ring-amber-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mt-1 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">
                          Credit / Debit Card / Net Banking / UPI
                        </span>
                        <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                          Razorpay Test Mode
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 block mt-0.5">
                        Instant payment confirmation with automated receipt and tracking.
                      </span>
                    </div>
                  </label>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(4)}
                      className="rounded-full bg-[#ffd814] px-6 py-2 text-xs font-bold text-gray-900 hover:bg-yellow-400 shadow-xs"
                    >
                      Review items and delivery
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4: REVIEW ITEMS & DELIVERY */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-xs overflow-hidden">
              <div
                onClick={() => setActiveStep(4)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/70 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    4
                  </span>
                  <h2 className="text-base font-bold text-gray-900">
                    Review Items and Delivery
                  </h2>
                </div>
              </div>

              {activeStep === 4 && (
                <div className="border-t border-gray-200 p-5 bg-white space-y-5">
                  {/* Selected Slot Highlight Card */}
                  {selectedSlot ? (
                    <div className="rounded-lg border border-amber-300 bg-amber-50/50 p-4">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                        <Clock className="h-4 w-4 text-amber-700" />
                        Guaranteed Scheduled Window:
                      </div>
                      <p className="text-base font-extrabold text-gray-900">
                        {fmtDate(selectedSlot.date)} from {fmtTime(selectedSlot.start)} to {fmtTime(selectedSlot.end)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Pincode: <span className="font-semibold text-gray-900">{currentAddress.pincode}</span>. Your 4-digit OTP will be generated on order completion.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-center justify-between">
                      <span>No delivery slot selected yet.</span>
                      <button
                        onClick={() => setActiveStep(2)}
                        className="font-bold underline"
                      >
                        Select Slot
                      </button>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="divide-y divide-gray-100">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="py-3 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0] || ""}
                            alt={product.name}
                            className="h-12 w-12 object-contain rounded border border-gray-100 p-1"
                          />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-gray-500">Qty: {quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          ₹{(product.final_price * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {orderError && (
                    <div className="rounded-md bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                      <span>{orderError}</span>
                    </div>
                  )}

                  {/* Place Order CTA */}
                  <div className="pt-2">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placingOrder || !selectedSlot}
                      className="w-full sm:w-auto rounded-full bg-[#ffd814] px-8 py-3 text-sm font-bold text-gray-900 shadow hover:bg-yellow-400 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                    >
                      {placingOrder ? "Placing your order…" : "Place Your Order and Pay"}
                    </button>
                    <p className="text-[11px] text-gray-500 mt-2">
                      By placing your order, you agree to Nova Mart&apos;s privacy notice and conditions of use.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-5 shadow-xs space-y-4">
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedSlot}
                className="w-full rounded-full bg-[#ffd814] py-3 text-sm font-bold text-gray-900 shadow hover:bg-yellow-400 active:scale-95 transition border border-[#fcd200] disabled:opacity-50 cursor-pointer"
              >
                {placingOrder ? "Placing your order…" : "Place Your Order and Pay"}
              </button>

              <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
                <h3 className="font-bold text-sm text-gray-900">Order Summary</h3>
                <div className="flex justify-between text-gray-600">
                  <span>Items:</span>
                  <span>₹{itemsPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Scheduled Delivery:</span>
                  <span className="text-green-700 font-semibold">
                    {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-extrabold text-red-700">
                  <span>Order Total:</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {selectedSlot && (
                <div className="rounded-md bg-green-50 p-3 text-xs text-green-900 border border-green-200 space-y-0.5">
                  <span className="font-bold">Slot Confirmed:</span>
                  <p className="text-[11px]">
                    {fmtDate(selectedSlot.date)}, {fmtTime(selectedSlot.start)} – {fmtTime(selectedSlot.end)}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 text-[11px] text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Handover secured by 4-digit code.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
