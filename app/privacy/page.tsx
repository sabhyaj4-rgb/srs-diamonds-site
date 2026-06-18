import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("privacy");

export default function PrivacyPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("privacy") }} />;
}
