import { admin } from "./supabaseAdmin";
import { SEED_CATEGORIES, SEED_PRODUCTS, SeedProduct, SeedCategory } from "./seedData";

export interface ProductQueryOptions {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isDeal?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "rating" | "popular";
  page?: number;
  limit?: number;
}

export async function getCategories(): Promise<SeedCategory[]> {
  try {
    const { data, error } = await admin
      .from("categories")
      .select("id, name, slug, description, image, sort_order")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as SeedCategory[];
    }
  } catch {
    // fallback to local seed
  }
  return SEED_CATEGORIES;
}

export async function getProducts(options: ProductQueryOptions = {}): Promise<{
  products: SeedProduct[];
  total: number;
  page: number;
  pages: number;
}> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 12);

  // Try Supabase first
  try {
    let query = admin.from("products").select("*, categories!inner(slug)", { count: "exact" }).eq("is_active", true);

    if (options.category) {
      query = query.eq("categories.slug", options.category);
    }
    if (options.brand) {
      query = query.eq("brand", options.brand);
    }
    if (options.search) {
      query = query.ilike("name", `%${options.search}%`);
    }
    if (options.minPrice) {
      query = query.gte("final_price", options.minPrice);
    }
    if (options.maxPrice) {
      query = query.lte("final_price", options.maxPrice);
    }
    if (options.minRating) {
      query = query.gte("rating", options.minRating);
    }
    if (options.isDeal) {
      query = query.eq("is_deal", true);
    }
    if (options.isBestSeller) {
      query = query.eq("is_best_seller", true);
    }
    if (options.isNewArrival) {
      query = query.eq("is_new_arrival", true);
    }

    if (options.sort === "price-asc") {
      query = query.order("final_price", { ascending: true });
    } else if (options.sort === "price-desc") {
      query = query.order("final_price", { ascending: false });
    } else if (options.sort === "rating") {
      query = query.order("rating", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count, error } = await query.range(from, to);

    if (!error && data && data.length > 0) {
      const mapped = data.map((d: any) => ({
        ...d,
        category_slug: d.categories?.slug || "",
      })) as SeedProduct[];

      return {
        products: mapped,
        total: count || mapped.length,
        page,
        pages: Math.ceil((count || mapped.length) / limit),
      };
    }
  } catch {
    // fallback below
  }

  // Robust In-Memory Filter Engine over Seed Products
  let list = [...SEED_PRODUCTS];

  if (options.category) {
    list = list.filter((p) => p.category_slug === options.category);
  }
  if (options.brand) {
    list = list.filter((p) => p.brand.toLowerCase() === options.brand?.toLowerCase());
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (options.minPrice) {
    list = list.filter((p) => p.final_price >= (options.minPrice || 0));
  }
  if (options.maxPrice) {
    list = list.filter((p) => p.final_price <= (options.maxPrice || Infinity));
  }
  if (options.minRating) {
    list = list.filter((p) => p.rating >= (options.minRating || 0));
  }
  if (options.isDeal) {
    list = list.filter((p) => p.is_deal);
  }
  if (options.isBestSeller) {
    list = list.filter((p) => p.is_best_seller);
  }
  if (options.isNewArrival) {
    list = list.filter((p) => p.is_new_arrival);
  }
  if (options.isTrending) {
    list = list.filter((p) => p.is_trending);
  }

  // Sort
  if (options.sort === "price-asc") {
    list.sort((a, b) => a.final_price - b.final_price);
  } else if (options.sort === "price-desc") {
    list.sort((a, b) => b.final_price - a.final_price);
  } else if (options.sort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const paged = list.slice(start, start + limit);

  return {
    products: paged,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getProductBySlug(slug: string): Promise<SeedProduct | null> {
  const clean = decodeURIComponent(slug).toLowerCase().trim();
  try {
    const { data, error } = await admin
      .from("products")
      .select("*, categories!inner(slug)")
      .eq("slug", clean)
      .maybeSingle();

    if (!error && data) {
      return {
        ...data,
        category_slug: (data as any).categories?.slug || "",
      } as SeedProduct;
    }
  } catch {
    // fallback
  }

  return (
    SEED_PRODUCTS.find(
      (p) => p.slug.toLowerCase() === clean || p.id === clean
    ) || null
  );
}
