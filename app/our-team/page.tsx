import type { Metadata } from "next";
import { fragment } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("our-team");

export default function OurTeamPage() {
  return <div dangerouslySetInnerHTML={{ __html: fragment("team") }} />;
}
