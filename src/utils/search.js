// ─── Search utilities ────────────────────────────────────────────
// Pure functions extracted from App.jsx so they can be unit-tested
// without mounting React. `highlight` returns JSX and therefore
// lives in search.jsx — this file contains the string-matching logic only.

/** Friendly city labels used by the search so that typing "tokyo"
 *  matches a day whose `city` key is `"tokyo"`. Kept in sync with the
 *  CITY object in App.jsx — adding a city there means adding it here. */
const CITY_LABELS = {
  tokyo: "Tokyo",
  kyoto: "Kyoto",
  osaka: "Osaka",
  transit: "Transit",
  depart: "Départ",
};

/**
 * Does the given day match the search query?
 * Matches against title, alert, tips, activity titles/subtitles, city
 * name, and the human date ("27 avr", "Lun"). Case-insensitive.
 *
 * @param {object} day - A day entry from DAYS (see App.jsx).
 * @param {string} query - User-provided search string.
 * @returns {boolean} true if any field contains the query.
 */
export function matchesQuery(day, query) {
  if (!query) return true;
  if (!day) return false;
  const q = query.toLowerCase();
  if (day.title && day.title.toLowerCase().includes(q)) return true;
  if (day.alert && day.alert.toLowerCase().includes(q)) return true;
  if (day.city && (CITY_LABELS[day.city] || day.city).toLowerCase().includes(q)) return true;
  if (day.date && day.date.toLowerCase().includes(q)) return true;
  if (day.day && day.day.toLowerCase().includes(q)) return true;
  if (day.tips && day.tips.some(tip => tip && tip.toLowerCase().includes(q))) return true;
  if (day.meals) {
    for (const k of Object.keys(day.meals)) {
      const m = day.meals[k];
      if (!m) continue;
      if (
        (m.nom && m.nom.toLowerCase().includes(q)) ||
        (m.nomJp && m.nomJp.toLowerCase().includes(q)) ||
        (m.plat && m.plat.toLowerCase().includes(q)) ||
        (m.planB && m.planB.toLowerCase().includes(q)) ||
        (m.adresse && m.adresse.toLowerCase().includes(q))
      ) return true;
    }
  }
  if (!day.sections) return false;
  return day.sections.some(sec =>
    sec.items && sec.items.some(item =>
      (item.t && item.t.toLowerCase().includes(q)) ||
      (item.sub && item.sub.toLowerCase().includes(q))
    )
  );
}

/**
 * Count how many activities (items) within a day match the query.
 * Useful to show "3 résultats dans ce jour" next to a day card.
 *
 * @param {object} day - A day entry from DAYS.
 * @param {string} query - Search string.
 * @returns {number} Number of matching items (0 if no query).
 */
export function countItemMatches(day, query) {
  if (!query || !day) return 0;
  const q = query.toLowerCase();
  let n = 0;
  if (day.sections) {
    for (const sec of day.sections) {
      if (!sec.items) continue;
      for (const item of sec.items) {
        if (
          (item.t && item.t.toLowerCase().includes(q)) ||
          (item.sub && item.sub.toLowerCase().includes(q))
        ) n++;
      }
    }
  }
  if (day.meals) {
    for (const k of Object.keys(day.meals)) {
      const m = day.meals[k];
      if (!m) continue;
      if (
        (m.nom && m.nom.toLowerCase().includes(q)) ||
        (m.nomJp && m.nomJp.toLowerCase().includes(q)) ||
        (m.plat && m.plat.toLowerCase().includes(q)) ||
        (m.planB && m.planB.toLowerCase().includes(q)) ||
        (m.adresse && m.adresse.toLowerCase().includes(q))
      ) n++;
    }
  }
  return n;
}

/**
 * Count how many days in the list match the query.
 *
 * @param {object[]} days - Array of day entries.
 * @param {string} query - Search string.
 * @returns {number} Number of matching days.
 */
export function countMatches(days, query) {
  if (!query) return 0;
  return days.filter(d => matchesQuery(d, query)).length;
}
