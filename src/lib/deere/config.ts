export function isDeereEnabled(): boolean {
  return (
    process.env.DEERE_ENABLED === "true" &&
    Boolean(process.env.DEERE_CLIENT_ID) &&
    Boolean(process.env.DEERE_CLIENT_SECRET)
  );
}

export const DEERE_AUTH_URL =
  process.env.DEERE_AUTH_URL ?? "https://signin.johndeere.com/oauth2/aus78tnlaysMraFhC1t7/v1/authorize";

export const DEERE_TOKEN_URL =
  process.env.DEERE_TOKEN_URL ??
  "https://signin.johndeere.com/oauth2/aus78tnlaysMraFhC1t7/v1/token";

export const DEERE_API_BASE =
  process.env.DEERE_API_BASE ?? "https://sandboxapi.deere.com/platform";

export const DEERE_SCOPES =
  process.env.DEERE_SCOPES ?? "ag1 ag2 ag3 offline_access";

export function getDeereRedirectUri(origin: string): string {
  return (
    process.env.DEERE_REDIRECT_URI ?? `${origin}/api/deere/callback`
  );
}
