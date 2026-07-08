"use client";

import { ImageRow } from "@/components/datasets/image-row";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useImages } from "@/hooks/use-images";
import Link from "next/link";
import { useState } from "react";

export default function DatasetsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useImages({ search, page });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Datasets
      </h1>
      <p className="mt-1 text-sm text-ground-400">
        Your uploaded scenes. Run predictions, download originals, or remove images.
      </p>

      <div className="mt-6">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by filename or CRS"
          aria-label="Search images"
        />
      </div>

      <Card className="mt-4 px-5">
        {isLoading ? (
          <p className="py-8 text-sm text-ground-400">Loading images…</p>
        ) : data && data.items.length === 0 ? (
          <p className="py-8 text-sm text-ground-400">
            {search ? (
              "No images match this search."
            ) : (
              <>
                No images yet.{" "}
                <Link href="/upload" className="text-instrument underline">
                  Upload your first scene
                </Link>{" "}
                to get started.
              </>
            )}
          </p>
        ) : (
          <ul className="divide-y divide-ground-700">
            {data?.items.map((img) => <ImageRow key={img.id} image={img} />)}
          </ul>
        )}
      </Card>

      {data && data.total > data.page_size && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="readout text-xs text-ground-400">
            {data.total} images · page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-ground-700 bg-ground-800 px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-ground-700 bg-ground-800 px-3 py-1.5 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
