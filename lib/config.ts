export const TZ = "Asia/Kolkata";

// Edit these to change the delivery windows. Keep "HH:MM" format.
export const SLOT_WINDOWS = [
  { start: "09:00", end: "11:00" },
  { start: "11:00", end: "13:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
  { start: "18:00", end: "20:00" },
] as const;

export const DEFAULT_CAPACITY = 10; // deliveries per window per pincode
export const MAX_DAYS_AHEAD = 7;
export const MIN_LEAD_HOURS = 2;    // slot must start at least this far ahead
export const MAX_RESCHEDULES = 2;

/** YYYY-MM-DD in IST, `offsetDays` from today. */
export function istDate(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}

export function validDates(): string[] {
  return Array.from({ length: MAX_DAYS_AHEAD }, (_, i) => istDate(i));
}

export function slotStartMs(date: string, start: string): number {
  return Date.parse(`${date}T${start}:00+05:30`);
}

export function isTooSoon(date: string, start: string): boolean {
  return slotStartMs(date, start) < Date.now() + MIN_LEAD_HOURS * 3_600_000;
}

export function isValidWindow(start: unknown, end: unknown): boolean {
  return SLOT_WINDOWS.some((w) => w.start === start && w.end === end);
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** "09:00" or "09:00:00" -> "9 AM", "14:30" -> "2:30 PM" */
export function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
}

export function fmtDate(d: string): string {
  return new Date(`${d}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", timeZone: TZ,
  });
}
