import { Scene } from "@/app/scene/Scene";
import { DebugSyncButton } from "./debug-sync-button";
import { groupItems, type LibraryItem } from "@/lib/library-groups";
import { readLibraryCache } from "@/lib/library-cache";

const PLAYLIST_SLOTS = 6; // 3 in shelf-left + 3 in shelf-right
const ALBUM_SLOTS = 4; // shelf-top band

export default async function Home() {
  const cache = await readLibraryCache();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-950">
      <div className="absolute bottom-2 right-2 z-40">
        <DebugSyncButton />
      </div>

      {cache ? (
        <SceneFromCache
          playlists={cache.playlists.map(
            (p): LibraryItem => ({
              id: p.id,
              name: p.name,
              imageUrl: p.imageUrl,
              subtitle: `${p.trackCount} track${p.trackCount === 1 ? "" : "s"}`,
            })
          )}
          albums={cache.albums.map(
            (a): LibraryItem => ({
              id: a.id,
              name: a.name,
              imageUrl: a.imageUrl,
              subtitle: a.artist,
            })
          )}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-zinc-400">
          No library synced yet — log in and hit &ldquo;Sync Library&rdquo; above.
        </div>
      )}
    </div>
  );
}

function SceneFromCache({ playlists, albums }: { playlists: LibraryItem[]; albums: LibraryItem[] }) {
  const playlistGroups = groupItems(playlists, PLAYLIST_SLOTS);
  const albumGroups = groupItems(albums, ALBUM_SLOTS);
  const half = Math.ceil(playlistGroups.length / 2);

  return (
    <Scene
      playlistGroupsLeft={playlistGroups.slice(0, half)}
      playlistGroupsRight={playlistGroups.slice(half)}
      albumGroupsTop={albumGroups}
    />
  );
}
