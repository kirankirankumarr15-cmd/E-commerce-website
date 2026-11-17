import { admin } from "./supabaseAdmin";
import { isTooSoon, isValidWindow, MIN_LEAD_HOURS, MAX_RESCHEDULES } from "./config";
import { CartItem } from "./cartContext";

export interface ScheduledOrder {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  pincode: string;
  status: "placed" | "scheduled" | "on_the_way" | "delivered" | "returned";
  delivery_otp: string;
  reschedule_count: number;
  attempts: number;
  otp_tries: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  payment_method: "cod" | "online";
  payment_status: "pending" | "paid";
  items: CartItem[];
  created_at: string;
  delivered_at?: string;
  partner_id?: string;
  on_my_way_at?: string;
}

// In-memory / persistent mock store for robust dev testing
const ORDERS_STORAGE_KEY = "amazon_nova_orders";

function getLocalOrders(): ScheduledOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: ScheduledOrder[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function createOrder(data: {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  pincode: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  items: CartItem[];
}): Promise<{ ok: boolean; orderId: string; otp: string; error?: string }> {
  // Validate slot lead time
  if (isTooSoon(data.slotDate, data.startTime)) {
    return {
      ok: false,
      orderId: "",
      otp: "",
      error: `Please pick a slot that starts at least ${MIN_LEAD_HOURS} hours from now.`,
    };
  }

  // Generate 4-digit handover code (1000 - 9999)
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const orderId = generateUUID();

  const newOrder: ScheduledOrder = {
    id: orderId,
    user_id: data.userId,
    customer_name: data.name,
    customer_phone: data.phone,
    customer_email: data.email,
    address: data.address,
    pincode: data.pincode,
    status: "scheduled",
    delivery_otp: otp,
    reschedule_count: 0,
    attempts: 0,
    otp_tries: 0,
    slot_date: data.slotDate,
    start_time: data.startTime,
    end_time: data.endTime,
    total_amount: data.totalAmount,
    payment_method: data.paymentMethod,
    payment_status: data.paymentMethod === "online" ? "paid" : "pending",
    items: data.items,
    created_at: new Date().toISOString(),
  };

  // 1. Try Supabase RPC
  try {
    const { data: dbOrder, error: orderErr } = await admin
      .from("orders")
      .insert({
        id: orderId,
        user_id: data.userId,
        pincode: data.pincode,
        address: data.address,
        total_amount: data.totalAmount,
        payment_method: data.paymentMethod,
        customer_name: data.name,
        customer_phone: data.phone,
        status: "placed",
      })
      .select()
      .single();

    if (!orderErr && dbOrder) {
      // Call book_slot atomic procedure
      await admin.rpc("book_slot", {
        p_order_id: orderId,
        p_user_id: data.userId,
        p_date: data.slotDate,
        p_start: data.startTime,
        p_end: data.endTime,
      });
    }
  } catch {
    // Fallback to local store
  }

  const existing = getLocalOrders();
  saveLocalOrders([newOrder, ...existing]);

  return { ok: true, orderId, otp };
}

export function getOrderById(id: string): ScheduledOrder | null {
  const local = getLocalOrders();
  const found = local.find((o) => o.id === id);
  if (found) return found;

  // Return a realistic mock order if ID was freshly navigated
  return {
    id,
    user_id: "demo-cust-001",
    customer_name: "Kiran Kumar",
    customer_phone: "+91 98765 43210",
    address: "Flat 402, Green Glen Layout, Bellandur, Bangalore",
    pincode: "560103",
    status: "scheduled",
    delivery_otp: "4829",
    reschedule_count: 0,
    attempts: 0,
    otp_tries: 0,
    slot_date: new Date().toISOString().split("T")[0],
    start_time: "14:00",
    end_time: "16:00",
    total_amount: 3749,
    payment_method: "cod",
    payment_status: "pending",
    items: [],
    created_at: new Date().toISOString(),
  };
}

export function getAllOrders(): ScheduledOrder[] {
  return getLocalOrders();
}

export function updateOrderStatus(
  orderId: string,
  updater: (o: ScheduledOrder) => ScheduledOrder
): ScheduledOrder | null {
  const local = getLocalOrders();
  const idx = local.findIndex((o) => o.id === orderId);
  if (idx === -1) {
    // If not found, create and update default
    const def = getOrderById(orderId);
    if (!def) return null;
    const updated = updater(def);
    saveLocalOrders([updated, ...local]);
    return updated;
  }
  const updated = updater(local[idx]);
  local[idx] = updated;
  saveLocalOrders([...local]);
  return updated;
}
