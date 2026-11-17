"use client";

import React, { useState } from "react";
import {
  Truck,
  Plus,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  User,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  phone: string;
  pincodes: string[];
  vehicle: string;
  active: boolean;
  activeDrops: number;
}

const INITIAL_PARTNERS: Partner[] = [
  {
    id: "part-1",
    name: "Rajesh Kumar",
    phone: "+91 98765 12345",
    pincodes: ["560103", "560037", "560068"],
    vehicle: "KA-01-AB-1234 (EV Scooter)",
    active: true,
    activeDrops: 3,
  },
  {
    id: "part-2",
    name: "Suresh Gowda",
    phone: "+91 98765 67890",
    pincodes: ["577201", "577202", "577203"],
    vehicle: "KA-14-EA-5678 (EV Van)",
    active: true,
    activeDrops: 2,
  },
  {
    id: "part-3",
    name: "Anand Verma",
    phone: "+91 98765 11223",
    pincodes: ["560001", "560025"],
    vehicle: "KA-05-MJ-9911 (Motorcycle)",
    active: false,
    activeDrops: 0,
  },
];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [pincodesStr, setPincodesStr] = useState("560103, 560037");

  const filtered = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.pincodes.some((pin) => pin.includes(search))
  );

  const toggleActive = (id: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const pincodes = pincodesStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^\d{6}$/.test(s));

    const newPartner: Partner = {
      id: `part-${Date.now()}`,
      name,
      phone,
      pincodes: pincodes.length > 0 ? pincodes : ["560103"],
      vehicle: vehicle || "Standard Delivery Vehicle",
      active: true,
      activeDrops: 0,
    };

    setPartners([newPartner, ...partners]);
    setShowModal(false);
    setName("");
    setPhone("");
    setVehicle("");
    setPincodesStr("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Delivery Fleet & Partners</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage field delivery executives, coverage pincodes, and active assignments.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#ffd814] px-4 py-2 text-xs font-bold text-gray-900 shadow-2xs hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4" />
          Add Delivery Partner
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners by name, phone, or assigned pincode…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-1.5 pl-9 pr-3 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((partner) => (
          <div
            key={partner.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{partner.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {partner.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleActive(partner.id)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    partner.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {partner.active ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Vehicle:</span>
                  <span className="font-medium text-gray-800">{partner.vehicle}</span>
                </div>

                <div>
                  <span className="text-gray-500 block text-[11px] mb-1">
                    Coverage Pincodes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {partner.pincodes.map((pin) => (
                      <span
                        key={pin}
                        className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-900"
                      >
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Today&apos;s Drops:{" "}
                <span className="font-bold text-gray-900">{partner.activeDrops}</span>
              </span>

              <a
                href="/delivery"
                className="text-[#007185] hover:text-[#c45500] font-semibold text-[11px]"
              >
                Open Driver View →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PARTNER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">
                Add Delivery Partner
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Vehicle Type / Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. KA-03-HH-4567 (EV Scooter)"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Assigned Pincodes (comma-separated 6-digit codes)
                </label>
                <input
                  type="text"
                  placeholder="560103, 560037, 560068"
                  value={pincodesStr}
                  onChange={(e) => setPincodesStr(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#ffd814] px-5 py-2 font-bold text-gray-900 hover:bg-yellow-400"
                >
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
