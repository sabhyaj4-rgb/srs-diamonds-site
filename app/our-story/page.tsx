import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("our-story");

export default function OurStoryPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("about") }} />;
}
