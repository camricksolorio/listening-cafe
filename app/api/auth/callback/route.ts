import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { APP_ORIGIN, exchangeCodeForTokens } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const session = await getSession();

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, APP_ORIGIN));
  }

  if (!code || !state || state !== session.state || !session.codeVerifier) {
    return NextResponse.redirect(new URL("/?error=invalid_state", APP_ORIGIN));
  }

  const tokens = await exchangeCodeForTokens(code, session.codeVerifier);

  session.accessToken = tokens.access_token;
  session.refreshToken = tokens.refresh_token ?? session.refreshToken;
  session.expiresAt = Date.now() + tokens.expires_in * 1000;
  session.codeVerifier = undefined;
  session.state = undefined;
  await session.save();

  return NextResponse.redirect(new URL("/", APP_ORIGIN));
}
