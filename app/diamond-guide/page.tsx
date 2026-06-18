import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("diamond-guide");

export default function DiamondGuidePage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("guide") }} />;
}
