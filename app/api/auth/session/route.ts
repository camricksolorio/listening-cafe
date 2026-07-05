import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/auth";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  const accessToken = await getValidAccessToken(session);

  if (!accessToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "spotify_error" }, { status: res.status });
  }

  const profile = await res.json();
  return NextResponse.json({
    id: profile.id,
    displayName: profile.display_name,
    imageUrl: profile.images?.[0]?.url ?? null,
  });
}
