import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("news");

export default function NewsPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("news") }} />;
}
