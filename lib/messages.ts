import { fmtDate, fmtTime } from "./config";

type Payload = Record<string, any>;

export function buildMessage(kind: string, p: Payload, orderId: string): { subject: string; text: string } | null {
  const base = process.env.APP_URL ?? "";
  const link = `${base}/orders/${orderId}/schedule`;
  const when = p.date && p.start
    ? `${fmtDate(p.date)}, ${fmtTime(String(p.start).slice(0, 5))} to ${fmtTime(String(p.end ?? p.start).slice(0, 5))}`
    : "";

  switch (kind) {
    case "booked":
    case "rescheduled":
      return {
        subject: kind === "booked" ? "Your delivery is scheduled" : "Your delivery time was changed",
        text: `Your order will arrive on ${when}.\nHandover code: ${p.otp}. Share it only when you receive the package.\nChange the time: ${link}`,
      };
    case "reminder":
      return {
        subject: "Your delivery arrives within the hour",
        text: `Your order arrives ${when}. Please be available.\nHandover code: ${p.otp}.\nCan't make it? Reschedule: ${link}`,
      };
    case "on_my_way":
      return {
        subject: "Your delivery partner is on the way",
        text: `Your delivery partner has started towards you (window ${when}). Keep your handover code ready.`,
      };
    case "missed":
      return p.returned
        ? { subject: "Your order is being returned", text: `We missed you twice, so your order is being returned. Contact support to arrange a new delivery.` }
        : { subject: "We missed you. Pick a new time", text: `Your delivery partner couldn't reach you. Choose a new time: ${link}\nOne more missed attempt and the order is returned.` };
    default:
      return null;
  }
}
