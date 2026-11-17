export type Contact = { email?: string | null; phone?: string | null };

/**
 * Sends one message. Returns true only if a provider accepted it.
 * Email works out of the box with Resend (RESEND_API_KEY + MAIL_FROM).
 * SMS / WhatsApp: add your provider (MSG91, Twilio, Gupshup...) in the marked block.
 */
export async function sendMessage(to: Contact, subject: string, text: string): Promise<boolean> {
  let sent = false;

  if (to.email && process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to.email], subject, text }),
    });
    sent = res.ok;
  }

  // ---- SMS / WhatsApp provider goes here (use to.phone). Set `sent = true` on success. ----

  if (!sent) console.warn(`[notify] not sent (no provider configured or provider failed): ${subject}`);
  return sent;
}
