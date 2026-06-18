import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("exhibitions");

export default function ExhibitionsPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("events") }} />;
}
