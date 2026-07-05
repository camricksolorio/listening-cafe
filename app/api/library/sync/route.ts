import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/auth";
import { writeLibraryCache } from "@/lib/library-cache";
import { getSession } from "@/lib/session";
import { fetchAllPlaylists, fetchAllSavedAlbums } from "@/lib/spotify";

export async function POST() {
  const session = await getSession();
  const accessToken = await getValidAccessToken(session);

  if (!accessToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [playlists, albums] = await Promise.all([
    fetchAllPlaylists(accessToken),
    fetchAllSavedAlbums(accessToken),
  ]);

  await writeLibraryCache({
    syncedAt: Date.now(),
    playlists,
    albums,
  });

  return NextResponse.json({
    status: "success",
    playlistsCount: playlists.length,
    albumsCount: albums.length,
  });
}
