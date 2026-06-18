import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("terms");

export default function TermsPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("terms") }} />;
}
