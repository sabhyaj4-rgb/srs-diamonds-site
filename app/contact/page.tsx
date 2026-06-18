import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("contact");

export default function ContactPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("contact") }} />;
}
