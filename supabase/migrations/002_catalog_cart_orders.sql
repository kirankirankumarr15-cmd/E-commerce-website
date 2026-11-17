-- ============ 002_catalog_cart_orders.sql ============

-- 1. Categories Table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Products Table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  short_description text,
  price numeric(10,2) not null check (price >= 0),
  discount int not null default 0 check (discount >= 0 and discount <= 100),
  final_price numeric(10,2) generated always as (round(price * (100 - discount) / 100, 2)) stored,
  category_id uuid references categories(id) on delete set null,
  brand text not null default 'NOVA MART',
  images text[] not null default '{}',
  stock int not null default 100 check (stock >= 0),
  sku text unique,
  rating numeric(2,1) not null default 4.5 check (rating >= 0 and rating <= 5),
  num_reviews int not null default 0 check (num_reviews >= 0),
  specifications jsonb not null default '{}',
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  is_deal boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Full-text search index on products
create index if not exists idx_products_search on products using gin (
  to_tsvector('english', name || ' ' || description || ' ' || brand || ' ' || array_to_string(tags, ' '))
);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_price on products(final_price);
create index if not exists idx_products_rating on products(rating);

-- 3. Customer Saved Addresses
create table if not exists user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  street text not null,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4. Order Details & Items
alter table orders
  add column if not exists total_amount numeric(10,2) not null default 0,
  add column if not exists payment_method text not null default 'cod',    -- cod | online
  add column if not exists payment_status text not null default 'pending',-- pending | paid | failed
  add column if not exists customer_name text,
  add column if not exists customer_phone text,
  add column if not exists customer_email text,
  add column if not exists invoice_number text;

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  product_name text not null,
  product_image text,
  price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now()
);

-- 5. Product Reviews
create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null default 'Verified Customer',
  rating int not null check (rating >= 1 and rating <= 5),
  title text,
  comment text not null,
  verified_purchase boolean not null default true,
  created_at timestamptz not null default now()
);

-- 6. Customer Wishlist
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- 7. Admin Slot Capacity & Date Blocks
create table if not exists slot_blocks (
  id uuid primary key default gen_random_uuid(),
  pincode text not null,
  slot_date date not null,
  start_time time, -- null means the entire day is blocked
  reason text not null default 'Maintenance or holiday',
  created_at timestamptz not null default now()
);

-- 8. Enable RLS
alter table categories enable row level security;
alter table products enable row level security;
alter table user_addresses enable row level security;
alter table order_items enable row level security;
alter table product_reviews enable row level security;
alter table wishlists enable row level security;
alter table slot_blocks enable row level security;

-- Public Read Policies
drop policy if exists "categories readable by all" on categories;
create policy "categories readable by all" on categories for select using (true);

drop policy if exists "products readable by all" on products;
create policy "products readable by all" on products for select using (is_active = true);

drop policy if exists "reviews readable by all" on product_reviews;
create policy "reviews readable by all" on product_reviews for select using (true);

-- User Isolation Policies
drop policy if exists "own addresses manage" on user_addresses;
create policy "own addresses manage" on user_addresses for all using (auth.uid() = user_id);

drop policy if exists "own order items read" on order_items;
create policy "own order items read" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

drop policy if exists "own wishlists manage" on wishlists;
create policy "own wishlists manage" on wishlists for all using (auth.uid() = user_id);

drop policy if exists "authenticated can review" on product_reviews;
create policy "authenticated can review" on product_reviews for insert with check (auth.uid() = user_id);

drop policy if exists "slot blocks readable" on slot_blocks;
create policy "slot blocks readable" on slot_blocks for select using (true);
