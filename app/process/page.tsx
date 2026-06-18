import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("process");

export default function ProcessPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("process") }} />;
}
