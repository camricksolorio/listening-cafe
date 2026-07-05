const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

// Derived from the registered redirect URI rather than the incoming request —
// Next's dev server can report a request's URL as "localhost" even when it
// was actually reached via 127.0.0.1, which would send post-login redirects
// to an origin that doesn't have the session cookie.
export const APP_ORIGIN = new URL(process.env.SPOTIFY_REDIRECT_URI!).origin;

export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
].join(" ");

export function getAuthorizeUrl({ codeChallenge, state }: { codeChallenge: string; state: string }): string {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
    scope: SPOTIFY_SCOPES,
  });
  return `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`;
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    code_verifier: codeVerifier,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Spotify token exchange failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: process.env.SPOTIFY_CLIENT_ID!,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Spotify token refresh failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export interface PlaylistSummary {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  trackCount: number;
}

export interface AlbumSummary {
  id: string;
  name: string;
  artist: string;
  imageUrl: string | null;
}

async function fetchAllPaginated(accessToken: string, initialUrl: string): Promise<unknown[]> {
  const items: unknown[] = [];
  let url: string | null = initialUrl;

  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      throw new Error(`Spotify request failed: ${res.status} ${await res.text()}`);
    }
    const data: { items: unknown[]; next: string | null } = await res.json();
    items.push(...data.items);
    url = data.next;
  }

  return items;
}

function normalizePlaylist(raw: any): PlaylistSummary {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || null,
    imageUrl: raw.images?.[0]?.url ?? null,
    trackCount: raw.tracks?.total ?? 0,
  };
}

function normalizeAlbum(raw: any): AlbumSummary {
  const album = raw.album ?? raw; // legacy /me/albums wraps in { added_at, album }
  return {
    id: album.id,
    name: album.name,
    artist: album.artists?.map((a: { name: string }) => a.name).join(", ") ?? "Unknown Artist",
    imageUrl: album.images?.[0]?.url ?? null,
  };
}

export async function fetchAllPlaylists(accessToken: string): Promise<PlaylistSummary[]> {
  const raw = await fetchAllPaginated(accessToken, "https://api.spotify.com/v1/me/playlists?limit=50");
  return raw.filter(Boolean).map(normalizePlaylist);
}

export async function fetchAllSavedAlbums(accessToken: string): Promise<AlbumSummary[]> {
  try {
    const raw = await fetchAllPaginated(
      accessToken,
      "https://api.spotify.com/v1/me/library?type=album&limit=50"
    );
    return raw.filter(Boolean).map(normalizeAlbum);
  } catch {
    // Fall back to the legacy endpoint in case /me/library isn't live yet on this account/app.
    const raw = await fetchAllPaginated(accessToken, "https://api.spotify.com/v1/me/albums?limit=50");
    return raw.filter(Boolean).map(normalizeAlbum);
  }
}
