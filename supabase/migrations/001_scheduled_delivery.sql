-- ============ 001_scheduled_delivery.sql ============
create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  pincode text not null,
  address text not null,
  status text not null default 'placed',      -- placed | scheduled | delivered | returned
  created_at timestamptz not null default now()
);

create table if not exists delivery_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  pincode text not null,
  capacity int not null default 10 check (capacity > 0),
  booked int not null default 0 check (booked >= 0),
  unique (slot_date, start_time, pincode),
  check (booked <= capacity)
);

alter table orders
  add column if not exists slot_id uuid references delivery_slots(id),
  add column if not exists reschedule_count int not null default 0,
  add column if not exists attempts int not null default 0,
  add column if not exists delivery_otp text,
  add column if not exists otp_tries int not null default 0,
  add column if not exists delivered_at timestamptz,
  add column if not exists partner_id uuid references auth.users(id),
  add column if not exists on_my_way_at timestamptz;

create table if not exists delivery_partners (
  user_id uuid primary key references auth.users(id),
  name text not null,
  pincodes text[] not null default '{}',
  active boolean not null default true
);

create table if not exists delivery_events (
  id bigserial primary key,
  order_id uuid not null references orders(id),
  type text not null,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Outbox: rows are created by the functions below, sent by /api/cron/notifications
create table if not exists notifications (
  id bigserial primary key,
  order_id uuid not null references orders(id),
  user_id uuid not null references auth.users(id),
  kind text not null,                         -- booked | rescheduled | reminder | on_my_way | missed
  payload jsonb not null default '{}',
  send_at timestamptz not null default now(),
  sent_at timestamptz,
  attempts int not null default 0,
  claimed_at timestamptz
);

create index if not exists idx_orders_slot on orders(slot_id);
create index if not exists idx_orders_pin_status on orders(pincode, status);
create index if not exists idx_notifications_due on notifications(send_at) where sent_at is null;

-- ---------- RLS ----------
alter table orders enable row level security;
alter table delivery_slots enable row level security;
alter table delivery_partners enable row level security;
alter table delivery_events enable row level security;
alter table notifications enable row level security;

drop policy if exists "own orders read" on orders;
create policy "own orders read" on orders for select using (auth.uid() = user_id);

drop policy if exists "slots readable" on delivery_slots;
create policy "slots readable" on delivery_slots for select to authenticated using (true);

-- ---------- Customer: book or reschedule (atomic, capacity-safe) ----------
create or replace function book_slot(
  p_order_id uuid, p_user_id uuid, p_date date, p_start time, p_end time,
  p_capacity int default 10, p_max_reschedules int default 2, p_lead_hours int default 2
) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare
  o orders%rowtype;
  cur_slot delivery_slots%rowtype;
  s delivery_slots%rowtype;
  v_otp text;
  v_payload jsonb;
begin
  select * into o from orders where id = p_order_id and user_id = p_user_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if o.status not in ('placed','scheduled') then raise exception 'NOT_SCHEDULABLE'; end if;

  if (p_date + p_start) at time zone 'Asia/Kolkata' < now() + make_interval(hours => p_lead_hours) then
    raise exception 'SLOT_TOO_SOON';
  end if;

  if o.slot_id is not null then
    select * into cur_slot from delivery_slots where id = o.slot_id;
    if (cur_slot.slot_date + cur_slot.start_time) at time zone 'Asia/Kolkata'
         < now() + make_interval(hours => p_lead_hours) then
      raise exception 'CHANGE_TOO_LATE';
    end if;
    if o.reschedule_count >= p_max_reschedules then raise exception 'RESCHEDULE_LIMIT'; end if;
  end if;

  insert into delivery_slots (slot_date, start_time, end_time, pincode, capacity)
  values (p_date, p_start, p_end, o.pincode, p_capacity)
  on conflict (slot_date, start_time, pincode) do nothing;

  select * into s from delivery_slots
   where slot_date = p_date and start_time = p_start and pincode = o.pincode for update;

  if s.id = o.slot_id then return s.id; end if;               -- same slot, nothing to do
  if s.booked >= s.capacity then raise exception 'SLOT_FULL'; end if;

  if o.slot_id is not null then
    update delivery_slots set booked = greatest(booked - 1, 0) where id = o.slot_id;
  end if;
  update delivery_slots set booked = booked + 1 where id = s.id;

  -- 4-digit handover code from a cryptographic source (1000-9999)
  v_otp := coalesce(o.delivery_otp,
    ((('x' || encode(gen_random_bytes(3), 'hex'))::bit(24)::int % 9000) + 1000)::text);

  update orders set
    slot_id = s.id,
    status = 'scheduled',
    reschedule_count = case when o.slot_id is null then reschedule_count else reschedule_count + 1 end,
    delivery_otp = v_otp,
    partner_id = null,
    on_my_way_at = null
  where id = o.id;

  v_payload := jsonb_build_object('date', p_date, 'start', p_start, 'end', p_end, 'otp', v_otp);
  delete from notifications where order_id = o.id and kind = 'reminder' and sent_at is null;
  insert into notifications(order_id, user_id, kind, payload, send_at) values
    (o.id, o.user_id, case when o.slot_id is null then 'booked' else 'rescheduled' end, v_payload, now()),
    (o.id, o.user_id, 'reminder', v_payload, ((p_date + p_start) at time zone 'Asia/Kolkata') - interval '1 hour');

  insert into delivery_events(order_id, type, meta)
  values (o.id, case when o.slot_id is null then 'scheduled' else 'rescheduled' end,
          jsonb_build_object('date', p_date, 'start', p_start));
  return s.id;
end $$;

-- ---------- Partner: "I'm on my way" (assigns the order to this partner) ----------
create or replace function start_trip(p_order_id uuid, p_partner uuid)
returns text language plpgsql security definer set search_path = public as $$
declare o orders%rowtype; pins text[]; s delivery_slots%rowtype;
begin
  select pincodes into pins from delivery_partners where user_id = p_partner and active;
  if pins is null then return 'FORBIDDEN'; end if;

  select * into o from orders where id = p_order_id for update;
  if not found or not (o.pincode = any(pins))
     or (o.partner_id is not null and o.partner_id <> p_partner) then return 'NOT_FOUND'; end if;
  if o.status <> 'scheduled' or o.slot_id is null then return 'NOT_DELIVERABLE'; end if;
  if o.on_my_way_at is not null then return 'ON_THE_WAY'; end if;   -- already sent, no duplicate message

  select * into s from delivery_slots where id = o.slot_id;
  if ((s.slot_date + s.start_time) at time zone 'Asia/Kolkata') - interval '30 minutes' > now() then
    return 'TOO_EARLY';
  end if;

  update orders set partner_id = p_partner, on_my_way_at = now() where id = o.id;
  insert into notifications(order_id, user_id, kind, payload)
  values (o.id, o.user_id, 'on_my_way',
          jsonb_build_object('date', s.slot_date, 'start', s.start_time, 'end', s.end_time));
  insert into delivery_events(order_id, type, meta)
  values (o.id, 'on_my_way', jsonb_build_object('partner', p_partner));
  return 'ON_THE_WAY';
end $$;

-- ---------- Partner: hand over with code ----------
create or replace function complete_delivery(p_order_id uuid, p_partner uuid, p_otp text)
returns text language plpgsql security definer set search_path = public as $$
declare o orders%rowtype; pins text[];
begin
  select pincodes into pins from delivery_partners where user_id = p_partner and active;
  if pins is null then return 'FORBIDDEN'; end if;

  select * into o from orders where id = p_order_id for update;
  if not found or not (o.pincode = any(pins))
     or (o.partner_id is not null and o.partner_id <> p_partner) then return 'NOT_FOUND'; end if;
  if o.status <> 'scheduled' then return 'NOT_DELIVERABLE'; end if;
  if o.otp_tries >= 5 then return 'LOCKED'; end if;

  if o.delivery_otp is distinct from p_otp then
    update orders set otp_tries = otp_tries + 1 where id = o.id;
    return 'WRONG_OTP';
  end if;

  update orders set status = 'delivered', delivered_at = now(), partner_id = p_partner where id = o.id;
  insert into delivery_events(order_id, type, meta)
  values (o.id, 'delivered', jsonb_build_object('partner', p_partner));
  return 'OK';
end $$;

-- ---------- Partner: customer not available ----------
-- 1st miss -> customer must pick a new slot. 2nd miss -> order is returned.
create or replace function mark_failed_attempt(p_order_id uuid, p_partner uuid)
returns text language plpgsql security definer set search_path = public as $$
declare o orders%rowtype; pins text[]; s delivery_slots%rowtype; new_attempts int;
begin
  select pincodes into pins from delivery_partners where user_id = p_partner and active;
  if pins is null then return 'FORBIDDEN'; end if;

  select * into o from orders where id = p_order_id for update;
  if not found or not (o.pincode = any(pins))
     or (o.partner_id is not null and o.partner_id <> p_partner) then return 'NOT_FOUND'; end if;
  if o.status <> 'scheduled' or o.slot_id is null then return 'NOT_DELIVERABLE'; end if;

  select * into s from delivery_slots where id = o.slot_id;
  if (s.slot_date + s.start_time) at time zone 'Asia/Kolkata' > now() then return 'TOO_EARLY'; end if;

  new_attempts := o.attempts + 1;
  update delivery_slots set booked = greatest(booked - 1, 0) where id = o.slot_id;
  update orders set
    attempts = new_attempts,
    slot_id = null,
    reschedule_count = 0,
    otp_tries = 0,
    partner_id = null,
    on_my_way_at = null,
    status = case when new_attempts >= 2 then 'returned' else 'placed' end
  where id = o.id;

  insert into notifications(order_id, user_id, kind, payload)
  values (o.id, o.user_id, 'missed',
          jsonb_build_object('attempt', new_attempts, 'returned', new_attempts >= 2));
  insert into delivery_events(order_id, type, meta)
  values (o.id, 'failed_attempt', jsonb_build_object('attempt', new_attempts, 'partner', p_partner));
  return case when new_attempts >= 2 then 'RETURNED' else 'RESCHEDULE' end;
end $$;

-- ---------- Worker: claim due notifications (safe with several workers) ----------
create or replace function claim_notifications(p_limit int default 20)
returns setof notifications language sql security definer set search_path = public as $$
  update notifications set attempts = attempts + 1, claimed_at = now()
  where id in (
    select id from notifications
    where sent_at is null and send_at <= now() and attempts < 5
      and (claimed_at is null or claimed_at < now() - interval '5 minutes')
    order by send_at limit p_limit for update skip locked)
  returning *;
$$;

-- Server-only. Block direct calls from browsers.
revoke execute on function book_slot(uuid, uuid, date, time, time, int, int, int) from public, anon, authenticated;
revoke execute on function start_trip(uuid, uuid) from public, anon, authenticated;
revoke execute on function complete_delivery(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function mark_failed_attempt(uuid, uuid) from public, anon, authenticated;
revoke execute on function claim_notifications(int) from public, anon, authenticated;
