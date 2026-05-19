import { NextRequest, NextResponse } from "next/server";
import {
  DEERE_AUTH_URL,
  DEERE_SCOPES,
  getDeereRedirectUri,
  isDeereEnabled,
} from "@/lib/deere/config";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
} from "@/lib/deere/pkce";
import { setPkceVerifier } from "@/lib/deere/session";

export async function GET(req: NextRequest) {
  if (!isDeereEnabled()) {
    return NextResponse.json(
      {
        error: "Deere integration disabled",
        hint: "Set DEERE_ENABLED=true and Deere developer credentials in .env",
      },
      { status: 503 }
    );
  }

  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = generateState();
  await setPkceVerifier(verifier, state);

  const origin = req.nextUrl.origin;
  const redirectUri = getDeereRedirectUri(origin);
  const url = new URL(DEERE_AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.DEERE_CLIENT_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", DEERE_SCOPES);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(url.toString());
}
