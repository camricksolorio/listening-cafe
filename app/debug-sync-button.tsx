"use client";

import { useState } from "react";

export function DebugSyncButton() {
  const [result, setResult] = useState<string | null>(null);

  async function handleSync() {
    setResult("syncing...");
    const res = await fetch("/api/library/sync", { method: "POST" });
    const data = await res.json();
    setResult(JSON.stringify(data));
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-zinc-400 p-4 text-sm">
      <p className="font-medium">Temporary debug: Milestone 2 sync test</p>
      <button
        onClick={handleSync}
        className="rounded-full bg-foreground px-4 py-2 text-background w-fit"
      >
        Sync Library
      </button>
      {result && <pre className="whitespace-pre-wrap break-all">{result}</pre>}
    </div>
  );
}
