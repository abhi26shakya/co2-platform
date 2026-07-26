"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { MapSearchResult } from "@/features/maps/lib/search";

interface Props {
  query: string;
  onQueryChange: (query: string) => void;
  results: MapSearchResult[];
  onSelect: (result: MapSearchResult) => void;
}

export function FacilitySearch({ query, onQueryChange, results, onSelect }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <Card className="p-3 bg-ground-900/40 border-ground-700/80">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ground-400" />
          <input
            type="text"
            placeholder="Search facility, city, lat, lon..."
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            className="w-full pl-8 pr-3 py-1.5 bg-ground-950 border border-ground-700/80 rounded-lg text-xs placeholder-ground-555 focus:outline-none focus:border-ground-400 text-instrument"
          />
        </div>
      </Card>

      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-ground-950 border border-ground-700 rounded-lg shadow-2xl z-20 overflow-hidden divide-y divide-ground-800 animate-in fade-in slide-in-from-top-1 duration-150">
          {results.map((result) => (
            <button
              key={result.id}
              onMouseDown={() => {
                onSelect(result);
                setFocused(false);
              }}
              className="w-full text-left p-3 hover:bg-ground-900 transition-colors flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="text-xs font-semibold text-instrument">{result.name}</span>
              <div className="flex items-center justify-between text-[10px] text-ground-400 font-mono">
                <span>{result.details}</span>
                <span>
                  {result.lat.toFixed(3)}, {result.lon.toFixed(3)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {focused && <div className="fixed inset-0 z-10" onClick={() => setFocused(false)} />}
    </div>
  );
}
