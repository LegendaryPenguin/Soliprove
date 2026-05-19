import { cookies } from "next/headers";

const COOKIE = "soilprove_deere_session";

export type DeereSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

export async function getDeereSession(): Promise<DeereSession | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DeereSession;
  } catch {
    return null;
  }
}

export async function setDeereSession(session: DeereSession) {
  const jar = await cookies();
  jar.set(COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearDeereSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

const PKCE_COOKIE = "soilprove_deere_pkce";

export async function setPkceVerifier(verifier: string, state: string) {
  const jar = await cookies();
  jar.set(PKCE_COOKIE, JSON.stringify({ verifier, state }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
}

export async function consumePkce(): Promise<{
  verifier: string;
  state: string;
} | null> {
  const jar = await cookies();
  const raw = jar.get(PKCE_COOKIE)?.value;
  jar.delete(PKCE_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
