import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("sustainability-compliance");

export default function SustainabilityCompliancePage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: fragment("sustainability") }} />
  );
}
