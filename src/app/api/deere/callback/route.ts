import { NextRequest, NextResponse } from "next/server";
import {
  DEERE_TOKEN_URL,
  getDeereRedirectUri,
  isDeereEnabled,
} from "@/lib/deere/config";
import { consumePkce, setDeereSession } from "@/lib/deere/session";

export async function GET(req: NextRequest) {
  const wizardUrl = new URL("/wizard", req.nextUrl.origin);
  wizardUrl.searchParams.set("step", "export");

  if (!isDeereEnabled()) {
    wizardUrl.searchParams.set("deere", "disabled");
    return NextResponse.redirect(wizardUrl);
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const pkce = await consumePkce();

  if (!code || !pkce || pkce.state !== state) {
    wizardUrl.searchParams.set("deere", "error");
    return NextResponse.redirect(wizardUrl);
  }

  const redirectUri = getDeereRedirectUri(req.nextUrl.origin);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: process.env.DEERE_CLIENT_ID!,
    client_secret: process.env.DEERE_CLIENT_SECRET!,
    code_verifier: pkce.verifier,
  });

  const tokenRes = await fetch(DEERE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenRes.ok) {
    wizardUrl.searchParams.set("deere", "token_error");
    return NextResponse.redirect(wizardUrl);
  }

  const tokens = await tokenRes.json();
  await setDeereSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
  });

  wizardUrl.searchParams.set("deere", "connected");
  return NextResponse.redirect(wizardUrl);
}
