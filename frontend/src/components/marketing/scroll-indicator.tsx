"use client";

import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  const handleScroll = () => {
    document.getElementById("platform")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleScroll}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer text-ground-400 hover:text-instrument transition-all duration-300 animate-bounce-subtle focus:outline-none"
      aria-label="Scroll to learn more about Emissia"
    >
      <ChevronDown className="h-4.5 w-4.5" />
      <span className="readout text-[11px] tracking-[0.25em] uppercase font-medium">
        Explore the Platform
      </span>
    </button>
  );
}
