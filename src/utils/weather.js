// ─── Weather code → icon mapping (Open-Meteo / WMO codes) ──────────
// https://open-meteo.com/en/docs (section "Weather variable documentation")

/**
 * Convert a WMO weather code into an emoji + short French label.
 *
 * @param {number|null|undefined} code - WMO weather code from the Open-Meteo API.
 * @returns {{ico: string, lbl: string}} Icon emoji + human label.
 */
export function wmoToIcon(code) {
  if (code == null) return { ico: "❓", lbl: "—" };
  if (code === 0) return { ico: "☀️", lbl: "Ensoleillé" };
  if (code <= 2)  return { ico: "🌤", lbl: "Partiellement nuageux" };
  if (code === 3) return { ico: "☁️", lbl: "Couvert" };
  if (code <= 48) return { ico: "🌫", lbl: "Brouillard" };
  if (code <= 57) return { ico: "🌦", lbl: "Bruine" };
  if (code <= 67) return { ico: "🌧", lbl: "Pluie" };
  if (code <= 77) return { ico: "🌨", lbl: "Neige" };
  if (code <= 82) return { ico: "🌧", lbl: "Averses" };
  if (code <= 86) return { ico: "🌨", lbl: "Averses de neige" };
  if (code <= 99) return { ico: "⛈", lbl: "Orage" };
  return { ico: "❓", lbl: "—" };
}

/**
 * Format a "time ago" label in French from a past timestamp.
 *
 * @param {number|null|undefined} ts - Past timestamp in ms (Date.now() compatible).
 * @param {number} [now] - Current time override (for tests). Defaults to Date.now().
 * @returns {string|null} e.g. "à l'instant", "il y a 12 min", "il y a 3h", or null.
 */
export function formatAge(ts, now = Date.now()) {
  if (!ts) return null;
  const mins = Math.round((now - ts) / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}
