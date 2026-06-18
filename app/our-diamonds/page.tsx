import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("our-diamonds");

export default function OurDiamondsPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("diamonds") }} />;
}
