"use client";

import { useState } from "react";
import type { LibraryGroup } from "@/lib/library-groups";
import { LEFT_SHELF_SLOTS, RIGHT_SHELF_SLOTS, TOP_SHELF_SLOTS, type SlotRect } from "@/lib/scene-slots";
import { GroupModal } from "./GroupModal";
import { VinylSleeve } from "./VinylSleeve";

interface SceneProps {
  playlistGroupsLeft: LibraryGroup[];
  playlistGroupsRight: LibraryGroup[];
  albumGroupsTop: LibraryGroup[];
}

type OpenGroup = { origin: "left" | "right" | "top"; group: LibraryGroup } | null;

function slotStyle(rect: SlotRect): React.CSSProperties {
  return {
    position: "absolute",
    left: `${rect.xPct}%`,
    top: `${rect.yPct}%`,
    width: `${rect.wPct}%`,
    height: `${rect.hPct}%`,
  };
}

function CenterFocal() {
  return (
    <div
      className="absolute flex items-end justify-center"
      style={{ left: "40%", top: "28%", width: "20%", height: "48%" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="h-20 w-14 rounded-t-full bg-zinc-700/80" />
        <div className="h-3 w-24 rounded bg-zinc-600/80" />
      </div>
    </div>
  );
}

export function Scene({ playlistGroupsLeft, playlistGroupsRight, albumGroupsTop }: SceneProps) {
  const [openGroup, setOpenGroup] = useState<OpenGroup>(null);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div
        className="relative"
        style={{
          aspectRatio: "1920 / 1080",
          width: "min(100vw, calc(100vh * 1920 / 1080))",
          maxHeight: "100vh",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/background.png" alt="" className="absolute inset-0 h-full w-full object-cover" />

        <CenterFocal />

        {playlistGroupsLeft.map((group, i) => (
          <div key={group.id} style={slotStyle(LEFT_SHELF_SLOTS[i])}>
            <VinylSleeve
              label={group.heroName}
              sublabel={`${group.items.length} playlist${group.items.length === 1 ? "" : "s"}`}
              imageUrl={group.heroImageUrl}
              variant="playlist"
              onClick={() => setOpenGroup({ origin: "left", group })}
            />
          </div>
        ))}

        {playlistGroupsRight.map((group, i) => (
          <div key={group.id} style={slotStyle(RIGHT_SHELF_SLOTS[i])}>
            <VinylSleeve
              label={group.heroName}
              sublabel={`${group.items.length} playlist${group.items.length === 1 ? "" : "s"}`}
              imageUrl={group.heroImageUrl}
              variant="playlist"
              onClick={() => setOpenGroup({ origin: "right", group })}
            />
          </div>
        ))}

        {albumGroupsTop.map((group, i) => (
          <div key={group.id} style={slotStyle(TOP_SHELF_SLOTS[i])}>
            <VinylSleeve
              label={group.heroName}
              sublabel={`${group.items.length} album${group.items.length === 1 ? "" : "s"}`}
              imageUrl={group.heroImageUrl}
              variant="album"
              onClick={() => setOpenGroup({ origin: "top", group })}
            />
          </div>
        ))}

        {openGroup && (
          <GroupModal
            title={openGroup.group.heroName}
            items={openGroup.group.items}
            origin={openGroup.origin}
            onClose={() => setOpenGroup(null)}
          />
        )}
      </div>
    </div>
  );
}
