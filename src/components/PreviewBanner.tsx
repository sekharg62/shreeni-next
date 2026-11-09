"use client";

import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { useTesterMode } from "@/lib/testerMode";

/** Fixed "launching soon" strip shown on every page while the store is in preview. */
export default function PreviewBanner() {
  // Mounted on every page, so `?tester=1` works from any URL.
  const tester = useTesterMode();
  if (!siteConfig.launch.preview) return null;
  return (
    <div role="status" className="bg-secondary px-4 py-2 text-center text-xs font-semibold tracking-wide text-surface sm:text-sm">
      <Sparkles className="mr-1.5 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
      {siteConfig.launch.message}
      {tester && <span className="ml-2 rounded bg-surface/20 px-1.5 py-0.5 text-[11px] uppercase">Tester mode</span>}
    </div>
  );
}
