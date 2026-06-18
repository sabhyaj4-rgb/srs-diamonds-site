import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("faq");

export default function FaqPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("faq") }} />;
}
