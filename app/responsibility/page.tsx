import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("responsibility");

export default function ResponsibilityPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("csr") }} />;
}
