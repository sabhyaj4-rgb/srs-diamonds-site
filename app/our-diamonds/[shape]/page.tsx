import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SHAPES, shapeBySlug, renderShapeDetailHtml } from "@/lib/shapes";

export function generateStaticParams() {
  return SHAPES.map((s) => ({ shape: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/our-diamonds/[shape]">
): Promise<Metadata> {
  const { shape } = await props.params;
  const s = shapeBySlug(shape);
  if (!s) return {};
  const title = `${s.name} Diamonds`;
  const description = `${s.name} diamonds from SRS Diamonds — ${s.tagline}. ${s.description}`;
  const path = `/our-diamonds/${s.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "SRS Diamonds",
      title,
      description,
      url: path,
      images: [s.image],
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [s.image],
    },
  };
}

export default async function ShapePage(
  props: PageProps<"/our-diamonds/[shape]">
) {
  const { shape } = await props.params;
  const s = shapeBySlug(shape);
  if (!s) notFound();
  return (
    <div className="page active" id="page-shape" data-shape-id={s.id}>
      <div
        id="shape-detail-content"
        dangerouslySetInnerHTML={{ __html: renderShapeDetailHtml(s.slug) }}
      />
    </div>
  );
}
