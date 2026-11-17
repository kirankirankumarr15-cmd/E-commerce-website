import { Suspense } from "react";
import SearchContent from "@/components/SearchContent";
import { SEED_CATEGORIES } from "@/lib/seedData";

export const dynamic = "force-dynamic";

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const mergedParams = {
    ...searchParams,
    category: params.slug,
  };

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-gray-500">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="mt-2 text-sm">Loading category products…</p>
        </div>
      }
    >
      <SearchContent initialParams={mergedParams} />
    </Suspense>
  );
}
