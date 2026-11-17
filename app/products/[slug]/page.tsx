import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Get related items in the same category
  const relatedRes = await getProducts({
    category: product.category_slug,
    limit: 5,
  });

  const related = relatedRes.products.filter((p) => p.id !== product.id).slice(0, 4);

  return <ProductDetailsClient product={product} related={related} />;
}
