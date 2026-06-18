import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("home");

export default function Home() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("home") }} />;
}
