import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce";
import { getSession } from "@/lib/session";
import { getAuthorizeUrl } from "@/lib/spotify";

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = randomBytes(16).toString("hex");

  const session = await getSession();
  session.codeVerifier = codeVerifier;
  session.state = state;
  await session.save();

  return NextResponse.redirect(getAuthorizeUrl({ codeChallenge, state }));
}
