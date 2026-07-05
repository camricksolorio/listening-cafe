import type { IronSession } from "iron-session";
import type { SessionData } from "@/lib/session";
import { refreshAccessToken } from "@/lib/spotify";

const EXPIRY_BUFFER_MS = 60_000; // refresh a minute before it actually expires

export async function getValidAccessToken(session: IronSession<SessionData>): Promise<string | null> {
  if (!session.accessToken || !session.refreshToken || !session.expiresAt) {
    return null;
  }

  if (Date.now() < session.expiresAt - EXPIRY_BUFFER_MS) {
    return session.accessToken;
  }

  const tokens = await refreshAccessToken(session.refreshToken);
  session.accessToken = tokens.access_token;
  session.expiresAt = Date.now() + tokens.expires_in * 1000;
  if (tokens.refresh_token) {
    session.refreshToken = tokens.refresh_token;
  }
  await session.save();

  return session.accessToken;
}
