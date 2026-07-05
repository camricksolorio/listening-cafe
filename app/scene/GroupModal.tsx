"use client";

import type { LibraryItem } from "@/lib/library-groups";

interface GroupModalProps {
  title: string;
  items: LibraryItem[];
  origin: "left" | "right" | "top";
  onClose: () => void;
}

const PANEL_POSITION: Record<GroupModalProps["origin"], string> = {
  left: "left-0 top-0 h-full w-1/2",
  right: "right-0 top-0 h-full w-1/2",
  top: "top-0 left-0 w-full h-[85vh]",
};

export function GroupModal({ title, items, origin, onClose }: GroupModalProps) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute overflow-y-auto bg-zinc-900 p-6 text-white shadow-2xl ${PANEL_POSITION[origin]}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">
            Close
          </button>
        </div>
        <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-1">
              <div className="aspect-square overflow-hidden rounded bg-zinc-800">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                )}
              </div>
              <p className="truncate text-sm font-medium">{item.name}</p>
              {item.subtitle && <p className="truncate text-xs text-zinc-400">{item.subtitle}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
