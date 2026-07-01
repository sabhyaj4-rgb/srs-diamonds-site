import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  message?: string;
  interests?: string[];
  shapes?: string[];
  _gotcha?: string;
};

function required(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const formId = process.env.FORMSPREE_FORM_ID;
  if (!formId) {
    console.error("FORMSPREE_FORM_ID is not configured");
    return NextResponse.json(
      { error: "Contact form is not configured." },
      { status: 503 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body._gotcha?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const { name, company, email, phone, country, message } = body;
  if (
    !required(name) ||
    !required(company) ||
    !required(email) ||
    !required(phone) ||
    !required(country) ||
    !required(message)
  ) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const compactPhone = phone.trim().replace(/[\s\-()]/g, "");
  const phoneOk =
    /^\+\d{6,15}$/.test(compactPhone) || /^00\d{6,15}$/.test(compactPhone);
  if (!emailOk || !phoneOk) {
    return NextResponse.json(
      { error: "Please enter a valid email and phone number with country code." },
      { status: 400 },
    );
  }

  const interests = Array.isArray(body.interests)
    ? body.interests.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    : [];
  const shapes = Array.isArray(body.shapes)
    ? body.shapes.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    : [];

  const formspreeRes = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      message: message.trim(),
      interests: interests.length ? interests.join(", ") : "None selected",
      shapes: shapes.length ? shapes.join(", ") : "None selected",
      _replyto: email.trim(),
      _subject: `Website Enquiry – ${name.trim()} (${company.trim()})`,
    }),
  });

  if (!formspreeRes.ok) {
    const detail = await formspreeRes.text().catch(() => "");
    console.error("Formspree submission failed:", formspreeRes.status, detail);
    return NextResponse.json(
      { error: "We could not send your enquiry right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
