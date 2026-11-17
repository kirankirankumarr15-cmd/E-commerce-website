import { describe, it, expect } from "vitest";
import {
  SLOT_WINDOWS,
  DEFAULT_CAPACITY,
  MAX_DAYS_AHEAD,
  MIN_LEAD_HOURS,
  MAX_RESCHEDULES,
  istDate,
  validDates,
  isValidWindow,
  isTooSoon,
  slotStartMs,
  UUID_RE,
  fmtTime,
  fmtDate,
} from "../lib/config";

describe("Scheduled Delivery Config & Rules", () => {
  it("enforces default business rules constants", () => {
    expect(DEFAULT_CAPACITY).toBe(10);
    expect(MAX_DAYS_AHEAD).toBe(7);
    expect(MIN_LEAD_HOURS).toBe(2);
    expect(MAX_RESCHEDULES).toBe(2);
    expect(SLOT_WINDOWS.length).toBe(5);
  });

  it("validates 2-hour window definitions correctly", () => {
    expect(isValidWindow("09:00", "11:00")).toBe(true);
    expect(isValidWindow("11:00", "13:00")).toBe(true);
    expect(isValidWindow("14:00", "16:00")).toBe(true);
    expect(isValidWindow("16:00", "18:00")).toBe(true);
    expect(isValidWindow("18:00", "20:00")).toBe(true);

    // Invalid windows
    expect(isValidWindow("10:00", "12:00")).toBe(false);
    expect(isValidWindow("09:00", "12:00")).toBe(false);
    expect(isValidWindow("", "")).toBe(false);
  });

  it("generates exactly 7 consecutive IST dates for booking horizon", () => {
    const dates = validDates();
    expect(dates).toHaveLength(7);
    expect(dates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dates[0]).toBe(istDate(0));
    expect(dates[1]).toBe(istDate(1));
    expect(dates[6]).toBe(istDate(6));
  });

  it("formats 24-hour time to AM/PM format accurately", () => {
    expect(fmtTime("09:00")).toBe("9 AM");
    expect(fmtTime("11:00")).toBe("11 AM");
    expect(fmtTime("14:00")).toBe("2 PM");
    expect(fmtTime("16:00")).toBe("4 PM");
    expect(fmtTime("18:30")).toBe("6:30 PM");
    expect(fmtTime("00:00")).toBe("12 AM");
    expect(fmtTime("12:00")).toBe("12 PM");
  });

  it("enforces 2-hour minimum lead time via isTooSoon", () => {
    // Past date should definitely be too soon
    expect(isTooSoon("2020-01-01", "09:00")).toBe(true);

    // Date far in the future should not be too soon
    expect(isTooSoon("2035-12-31", "14:00")).toBe(false);
  });

  it("validates RFC 4122 standard UUIDs", () => {
    expect(UUID_RE.test("c7b3d8e0-5e0b-4b0f-8b3a-9b8c7d6e5f4a")).toBe(true);
    expect(UUID_RE.test("12345678-1234-4234-8234-123456789abc")).toBe(true);

    // Invalid UUIDs
    expect(UUID_RE.test("invalid-uuid-string")).toBe(false);
    expect(UUID_RE.test("ord-123456789")).toBe(false);
    expect(UUID_RE.test("")).toBe(false);
  });
});
