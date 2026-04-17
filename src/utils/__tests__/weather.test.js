import { describe, it, expect } from "vitest";
import { wmoToIcon, formatAge } from "../weather.js";

describe("wmoToIcon", () => {
  it("returns the unknown icon for null/undefined", () => {
    expect(wmoToIcon(null)).toEqual({ ico: "❓", lbl: "—" });
    expect(wmoToIcon(undefined)).toEqual({ ico: "❓", lbl: "—" });
  });

  it("maps sunny weather", () => {
    expect(wmoToIcon(0).ico).toBe("☀️");
  });

  it("maps partly cloudy", () => {
    expect(wmoToIcon(2).ico).toBe("🌤");
  });

  it("maps overcast", () => {
    expect(wmoToIcon(3).ico).toBe("☁️");
  });

  it("maps rain to 🌧", () => {
    expect(wmoToIcon(65).ico).toBe("🌧");
  });

  it("maps thunderstorms to ⛈", () => {
    expect(wmoToIcon(95).ico).toBe("⛈");
  });

  it("falls back to unknown for out-of-range codes", () => {
    expect(wmoToIcon(999)).toEqual({ ico: "❓", lbl: "—" });
  });
});

describe("formatAge", () => {
  const now = 1_700_000_000_000; // fixed ref so tests are deterministic

  it("returns null for missing ts", () => {
    expect(formatAge(null, now)).toBeNull();
    expect(formatAge(0, now)).toBeNull();
  });

  it("returns 'à l'instant' for < 30 sec", () => {
    expect(formatAge(now - 10_000, now)).toBe("à l'instant");
  });

  it("formats minutes", () => {
    expect(formatAge(now - 12 * 60_000, now)).toBe("il y a 12 min");
  });

  it("formats hours", () => {
    expect(formatAge(now - 3 * 3600_000, now)).toBe("il y a 3h");
  });

  it("formats days past 24h", () => {
    expect(formatAge(now - 49 * 3600_000, now)).toBe("il y a 2j");
  });
});
