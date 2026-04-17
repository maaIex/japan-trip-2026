// ─── Highlight helper ────────────────────────────────────────────
// Wraps the first occurrence of `query` inside `text` with a <mark>
// so search hits stand out. Returns the raw text unchanged if nothing
// matches — callers can pass the result directly into JSX.

/**
 * Highlight the first occurrence of `query` within `text`.
 *
 * @param {string} text - The source string to search.
 * @param {string} query - The substring to highlight (case-insensitive).
 * @param {boolean} dark - True when the dark theme is active (adjusts colors).
 * @returns {import("react").ReactNode} The text, with a <mark> around the match.
 */
export function highlight(text, query, dark) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{
        background: dark ? "#854D0E" : "#FEF08A",
        color: dark ? "#FEF9C3" : "#78350F",
        borderRadius: "2px",
        padding: "0 1px",
      }}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}
