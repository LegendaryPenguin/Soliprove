export type GeolocationResult =
  | { ok: true; lat: number; lon: number }
  | { ok: false; message: string };

const ERROR_MESSAGES: Record<number, string> = {
  1: "Location permission denied. Allow location in your browser settings, or drop a pin on the map.",
  2: "Location unavailable. Check device GPS/Wi‑Fi or drop a pin manually.",
  3: "Location request timed out. Try again or drop a pin on the map.",
};

export function requestUserLocation(timeoutMs = 10000): Promise<GeolocationResult> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return Promise.resolve({
      ok: false,
      message:
        "Geolocation is not supported in this browser. Drop a pin on the map instead.",
    });
  }

  if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
    return Promise.resolve({
      ok: false,
      message:
        "Use HTTPS (or localhost) for “Use my location”. On production, deploy with SSL enabled.",
    });
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({
        ok: false,
        message: ERROR_MESSAGES[3],
      });
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({
          ok: true,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        clearTimeout(timer);
        resolve({
          ok: false,
          message: ERROR_MESSAGES[err.code] ?? "Could not get your location.",
        });
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
    );
  });
}
