interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `[email] To: ${payload.to} | Subject: ${payload.subject}\n`,
      payload.html.replace(/<[^>]+>/g, "").slice(0, 200),
    );
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "hello@healinghandsspa.com";
  await resend.emails.send({ from, ...payload });
}

export function verificationEmail(name: string, token: string, baseUrl: string): EmailPayload {
  const link = `${baseUrl}/verify-email?token=${token}`;
  return {
    to: "",
    subject: "Verify your Healing Hands account",
    html: `<p>Hi ${name},</p><p>Click <a href="${link}">here</a> to verify your email.</p><p>Link: ${link}</p>`,
  };
}

export function passwordResetEmail(name: string, token: string, baseUrl: string): EmailPayload {
  const link = `${baseUrl}/reset-password?token=${token}`;
  return {
    to: "",
    subject: "Reset your Healing Hands password",
    html: `<p>Hi ${name},</p><p>Click <a href="${link}">here</a> to reset your password. This link expires in 24 hours.</p>`,
  };
}

export function bookingConfirmEmail(
  name: string,
  serviceName: string,
  startAt: string,
): EmailPayload {
  return {
    to: "",
    subject: `Your ${serviceName} is confirmed`,
    html: `<p>Hi ${name},</p><p>Your ${serviceName} appointment is confirmed for ${new Date(startAt).toLocaleString()}.</p>`,
  };
}
