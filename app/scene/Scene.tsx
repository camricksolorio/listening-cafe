"use client";

import { useState } from "react";
import type { LibraryGroup } from "@/lib/library-groups";
import { GroupModal } from "./GroupModal";
import { VinylSleeve } from "./VinylSleeve";

interface SceneProps {
  playlistGroupsLeft: LibraryGroup[];
  playlistGroupsRight: LibraryGroup[];
  albumGroupsTop: LibraryGroup[];
}

type OpenGroup = { origin: "left" | "right" | "top"; group: LibraryGroup } | null;

function Speaker() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-zinc-800 py-8">
      <div className="h-12 w-12 rounded-full border-4 border-zinc-600 bg-zinc-700" />
      <div className="h-8 w-8 rotate-45 border-2 border-zinc-600 bg-zinc-700" />
      <div className="h-12 w-12 rounded-full border-4 border-zinc-600 bg-zinc-700" />
    </div>
  );
}

function ShelfColumn({
  groups,
  onSelect,
}: {
  groups: LibraryGroup[];
  onSelect: (group: LibraryGroup) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-evenly gap-4 bg-amber-900/20 p-3">
      {groups.map((group) => (
        <VinylSleeve
          key={group.id}
          label={group.heroName}
          sublabel={`${group.items.length} playlist${group.items.length === 1 ? "" : "s"}`}
          imageUrl={group.heroImageUrl}
          variant="playlist"
          onClick={() => onSelect(group)}
        />
      ))}
    </div>
  );
}

function ShelfTop({
  groups,
  onSelect,
}: {
  groups: LibraryGroup[];
  onSelect: (group: LibraryGroup) => void;
}) {
  return (
    <div className="grid h-full grid-cols-6 gap-3 rounded-b-lg bg-amber-900/20 p-3">
      {groups.map((group) => (
        <VinylSleeve
          key={group.id}
          label={group.heroName}
          sublabel={`${group.items.length} album${group.items.length === 1 ? "" : "s"}`}
          imageUrl={group.heroImageUrl}
          variant="album"
          onClick={() => onSelect(group)}
        />
      ))}
    </div>
  );
}

function CenterFocal() {
  return (
    <div className="flex h-full items-end justify-center pb-4">
      <div className="flex flex-col items-center gap-2">
        <div className="h-20 w-14 rounded-t-full bg-zinc-700" />
        <div className="h-3 w-24 rounded bg-zinc-600" />
      </div>
    </div>
  );
}

function DjController() {
  return (
    <div className="flex h-full items-center justify-center gap-6 bg-zinc-900 p-4">
      <div className="h-16 w-16 rounded-full border-4 border-zinc-600 bg-zinc-800" />
      <div className="flex items-end gap-2">
        <div className="h-12 w-2 rounded bg-zinc-600" />
        <div className="h-12 w-2 rounded bg-zinc-600" />
        <div className="h-6 w-6 rounded-sm bg-zinc-600" />
      </div>
      <div className="h-16 w-16 rounded-full border-4 border-zinc-600 bg-zinc-800" />
    </div>
  );
}

function BoothFront() {
  return (
    <div
      className="h-full bg-zinc-950"
      style={{ clipPath: "polygon(0 0,100% 0,100% 70%,90% 100%,10% 100%,0 70%)" }}
    />
  );
}

export function Scene({ playlistGroupsLeft, playlistGroupsRight, albumGroupsTop }: SceneProps) {
  const [openGroup, setOpenGroup] = useState<OpenGroup>(null);

  return (
    <div
      className="h-screen w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr 2fr 1fr 90px",
        gridTemplateRows: "1fr 1fr 140px 60px",
        gridTemplateAreas: `
          "speakerL shelfL shelfTop shelfR speakerR"
          "speakerL shelfL center shelfR speakerR"
          "speakerL shelfL controller shelfR speakerR"
          "speakerL shelfL front shelfR speakerR"
        `,
      }}
    >
      <div style={{ gridArea: "speakerL" }}>
        <Speaker />
      </div>
      <div style={{ gridArea: "shelfL" }}>
        <ShelfColumn
          groups={playlistGroupsLeft}
          onSelect={(group) => setOpenGroup({ origin: "left", group })}
        />
      </div>
      <div style={{ gridArea: "shelfTop" }}>
        <ShelfTop
          groups={albumGroupsTop}
          onSelect={(group) => setOpenGroup({ origin: "top", group })}
        />
      </div>
      <div style={{ gridArea: "shelfR" }}>
        <ShelfColumn
          groups={playlistGroupsRight}
          onSelect={(group) => setOpenGroup({ origin: "right", group })}
        />
      </div>
      <div style={{ gridArea: "speakerR" }}>
        <Speaker />
      </div>
      <div style={{ gridArea: "center" }}>
        <CenterFocal />
      </div>
      <div style={{ gridArea: "controller" }}>
        <DjController />
      </div>
      <div style={{ gridArea: "front" }}>
        <BoothFront />
      </div>

      {openGroup && (
        <GroupModal
          title={openGroup.group.heroName}
          items={openGroup.group.items}
          origin={openGroup.origin}
          onClose={() => setOpenGroup(null)}
        />
      )}
    </div>
  );
}
