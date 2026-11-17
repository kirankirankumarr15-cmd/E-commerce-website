import { Suspense } from "react";
import SearchContent from "@/components/SearchContent";

export const dynamic = "force-dynamic";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-gray-500">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="mt-2 text-sm">Searching Nova Mart catalog…</p>
        </div>
      }
    >
      <SearchContent initialParams={searchParams} />
    </Suspense>
  );
}
