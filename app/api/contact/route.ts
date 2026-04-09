import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const toEmail = process.env.CONTACT_TO_EMAIL ?? "sales@srsdiamonds.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

export async function POST(req: Request) {
  if (!resend) {
    return NextResponse.json(
      { ok: false, error: "Email service not configured on server." },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = body.name;
    const company = body.company;
    const email = body.email;
    const phone = body.phone;
    const country = body.country;
    const message = body.message;
    const interests = toStringArray(body.interests);
    const shapes = toStringArray(body.shapes);

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(company) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(phone) ||
      !isNonEmptyString(country) ||
      !isNonEmptyString(message)
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const subject = `Website Enquiry - ${name} (${company})`;
    const text = [
      "New Enquiry from SRS Diamonds Website",
      "========================================",
      "",
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Country: ${country}`,
      "",
      `Interested In: ${interests.length ? interests.join(", ") : "Not specified"}`,
      `Preferred Shapes: ${shapes.length ? shapes.join(", ") : "Not specified"}`,
      "",
      "Requirements:",
      message,
      "",
      "========================================",
      "Sent via srsdiamonds.com",
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send enquiry. Please try again." },
      { status: 500 }
    );
  }
}
