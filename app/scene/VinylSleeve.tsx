"use client";

interface VinylSleeveProps {
  label: string;
  sublabel?: string;
  imageUrl: string | null;
  onClick: () => void;
  variant: "playlist" | "album";
}

export function VinylSleeve({ label, sublabel, imageUrl, onClick, variant }: VinylSleeveProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative aspect-square w-full overflow-hidden rounded-sm shadow-md transition-transform duration-200 hover:z-10 hover:-translate-y-2 hover:shadow-2xl ${
        variant === "playlist" ? "border-l-4 border-amber-500" : "border border-zinc-700"
      }`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-xs text-zinc-400">
          No Art
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/85 p-1.5 text-left text-[10px] leading-tight text-white transition-transform duration-200 group-hover:translate-y-0">
        <p className="truncate font-semibold">{label}</p>
        {sublabel && <p className="truncate text-zinc-300">{sublabel}</p>}
      </div>
    </button>
  );
}
