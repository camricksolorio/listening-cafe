import { promises as fs } from "fs";
import path from "path";
import type { AlbumSummary, PlaylistSummary } from "@/lib/spotify";

const CACHE_DIR = path.join(process.cwd(), "data");
const CACHE_PATH = path.join(CACHE_DIR, "library-cache.json");

export interface LibraryCache {
  syncedAt: number;
  playlists: PlaylistSummary[];
  albums: AlbumSummary[];
}

export async function writeLibraryCache(cache: LibraryCache): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
}

export async function readLibraryCache(): Promise<LibraryCache | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf-8");
    return JSON.parse(raw) as LibraryCache;
  } catch {
    return null;
  }
}
