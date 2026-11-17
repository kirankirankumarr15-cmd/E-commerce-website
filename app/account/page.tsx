"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function AccountPage() {
  const { user, addresses, addAddress, loginDemo } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Bangalore");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("560103");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !pincode) return;
    addAddress({ fullName, phone, street, city, state, pincode });
    setShowAddModal(false);
    setFullName("");
    setPhone("");
    setStreet("");
  };

  return (
    <div className="bg-[#eaeded] min-h-screen py-8">
      <div className="container-narrow max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Your Account</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage your personal profile, delivery addresses, and shortcuts.
          </p>
        </div>

        {/* 3 Amazon Account Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/orders"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-sm transition flex items-center gap-4"
          >
            <div className="rounded-full bg-amber-50 p-3 text-amber-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">Your Orders</h2>
              <p className="text-xs text-gray-500">Track, reschedule, buy again</p>
            </div>
          </Link>

          <Link
            href="/delivery"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-sm transition flex items-center gap-4"
          >
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">Partner Portal</h2>
              <p className="text-xs text-gray-500">Delivery drops & OTP verify</p>
            </div>
          </Link>

          <Link
            href="/admin"
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-sm transition flex items-center gap-4"
          >
            <div className="rounded-full bg-purple-50 p-3 text-purple-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">Operations Console</h2>
              <p className="text-xs text-gray-500">Products, orders, slots CRUD</p>
            </div>
          </Link>
        </div>

        {/* Saved Addresses Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Delivery Addresses</h2>
              <p className="text-xs text-gray-500">
                Pincode determines your available 2-hour scheduled handover slots.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#ffd814] px-4 py-2 text-xs font-bold text-gray-900 hover:bg-yellow-400 shadow-2xs"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-lg border border-gray-200 p-4 relative flex flex-col justify-between"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-gray-900">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{addr.street}</p>
                  <p className="text-gray-700">
                    {addr.city}, {addr.state} -{" "}
                    <span className="font-bold text-gray-900">{addr.pincode}</span>
                  </p>
                  <p className="text-gray-500">Phone: {addr.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Persona Switcher */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-gray-900">
            Interactive Persona Switcher (Development Testing)
          </h2>
          <p className="text-xs text-gray-600">
            Switch between personas instantly to test the full customer, partner, and admin flows.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loginDemo("customer")}
              className="rounded-full bg-white border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-50"
            >
              Customer (Kiran)
            </button>
            <button
              onClick={() => loginDemo("partner")}
              className="rounded-full bg-white border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-50"
            >
              Delivery Partner (Rajesh)
            </button>
            <button
              onClick={() => loginDemo("admin")}
              className="rounded-full bg-white border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-50"
            >
              Admin / Operations Manager
            </button>
          </div>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">Add New Address</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Number *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Flat, House no., Building, Street *
                </label>
                <input
                  required
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City *</label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State *</label>
                  <input
                    required
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">6-digit Pincode *</label>
                  <input
                    required
                    maxLength={6}
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#ffd814] px-5 py-2 font-bold text-gray-900 hover:bg-yellow-400"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
