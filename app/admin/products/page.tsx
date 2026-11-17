"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  ExternalLink,
} from "lucide-react";
import { SEED_PRODUCTS, SEED_CATEGORIES, SeedProduct } from "@/lib/seedData";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<SeedProduct[]>(SEED_PRODUCTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);

  // New Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("electronics");
  const [newBrand, setNewBrand] = useState("");
  const [newPrice, setNewPrice] = useState<number>(1999);
  const [newDiscount, setNewDiscount] = useState<number>(20);
  const [newStock, setNewStock] = useState<number>(50);
  const [newImage, setNewImage] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "all" || p.category_slug === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleStartEdit = (product: SeedProduct) => {
    setEditingId(product.id);
    setEditStock(product.stock);
    setEditPrice(product.final_price);
  };

  const handleSaveEdit = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          stock: editStock,
          final_price: editPrice,
          price: Math.round(editPrice * 1.25),
        };
      })
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this product from the catalog?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const finalPrice = Math.round(newPrice * (100 - newDiscount) / 100);
    const newProduct: SeedProduct = {
      id: `prod-${Date.now()}`,
      name: newName,
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: newDescription || "High quality product from Nova Mart store.",
      short_description: newDescription?.slice(0, 80) || "High quality product.",
      price: newPrice,
      discount: newDiscount,
      final_price: finalPrice,
      category_slug: newCategory,
      brand: newBrand || "Nova Mart",
      images: [
        newImage ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop",
      ],
      stock: newStock,
      sku: `NM-${Date.now().toString().slice(-6)}`,
      rating: 4.8,
      num_reviews: 1,
      specifications: { Brand: newBrand || "Nova Mart", Condition: "Brand New" },
      tags: [newCategory],
      is_featured: false,
      is_deal: newDiscount > 20,
      is_best_seller: false,
      is_new_arrival: true,
      is_trending: false,
    };

    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    // Reset inputs
    setNewName("");
    setNewBrand("");
    setNewImage("");
    setNewDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage product inventory, pricing, images, and category assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#ffd814] px-4 py-2 text-xs font-bold text-gray-900 shadow-2xs hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, brand, or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-1.5 pl-9 pr-3 text-xs text-gray-900 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="cat-filter" className="text-xs text-gray-600 font-medium">
            Category:
          </label>
          <select
            id="cat-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {SEED_CATEGORIES.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => {
                const isEditing = editingId === product.id;

                return (
                  <tr key={product.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || ""}
                          alt={product.name}
                          className="h-10 w-10 object-contain rounded border border-gray-100 p-0.5"
                        />
                        <div>
                          <Link
                            href={`/products/${product.slug}`}
                            className="font-bold text-gray-900 hover:text-[#c45500] line-clamp-1 max-w-xs"
                          >
                            {product.name}
                          </Link>
                          <span className="text-[10px] text-gray-400">
                            SKU: {product.id.slice(0, 10)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 capitalize">
                        {product.category_slug}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-700">
                      {product.brand}
                    </td>

                    <td className="py-3 px-4 font-bold text-gray-900">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span>₹</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 rounded border border-gray-300 px-1.5 py-0.5 text-xs font-bold"
                          />
                        </div>
                      ) : (
                        <span>₹{product.final_price.toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-16 rounded border border-gray-300 px-1.5 py-0.5 text-xs font-bold"
                        />
                      ) : (
                        <span
                          className={`font-semibold ${
                            product.stock > 10 ? "text-green-700" : "text-red-600"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(product.id)}
                            className="p-1 rounded text-green-700 hover:bg-green-50"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded text-gray-500 hover:bg-gray-100"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(product)}
                            className="p-1 rounded text-gray-600 hover:text-amber-700"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1 rounded text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sony WH-1000XM5 Noise Canceling Headphones"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  >
                    {SEED_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Sony, Apple, Nike"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    M.R.P. (₹) *
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Key features and details about this item…"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs"
                />
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
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
