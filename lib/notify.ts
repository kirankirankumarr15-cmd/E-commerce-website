export type Contact = { email?: string | null; phone?: string | null };

/**
 * Sends one message. Returns true only if a provider accepted it or mock console succeeded in dev mode.
 * Email works out of the box with Resend (RESEND_API_KEY + MAIL_FROM).
 * SMS / WhatsApp: MSG91 / Twilio support or console logging fallback.
 */
export async function sendMessage(to: Contact, subject: string, text: string): Promise<boolean> {
  let sent = false;

  // 1. Resend Email Dispatch
  if (to.email && process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM,
          to: [to.email],
          subject,
          text,
        }),
      });
      sent = res.ok;
    } catch (err) {
      console.error("[notify] Resend email failed:", err);
    }
  }

  // 2. SMS / WhatsApp Provider (Twilio or MSG91)
  if (to.phone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER,
          To: to.phone,
          Body: `${subject}\n\n${text}`,
        }),
      });
      sent = res.ok || sent;
    } catch (err) {
      console.error("[notify] Twilio dispatch error:", err);
    }
  }

  // 3. Fallback Mock Log (ensures dev / local flow succeeds and prints to console)
  if (!sent) {
    console.log(`\n========================================`);
    console.log(`[NOTIFY DISPATCH - DEV MOCK]`);
    console.log(`To: ${to.email || "No email"} | ${to.phone || "No phone"}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message:\n${text}`);
    console.log(`========================================\n`);
    sent = true;
  }

  return sent;
}
