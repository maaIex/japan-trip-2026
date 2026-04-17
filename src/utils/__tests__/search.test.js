import { describe, it, expect } from "vitest";
import { matchesQuery, countMatches, countItemMatches } from "../search.js";

// A pared-down day shape matching what App.jsx's DAYS entries use.
const day = {
  n: 1,
  title: "Arrivée Haneda → Asakusa",
  date: "27 avr",
  day: "Lun",
  city: "tokyo",
  alert: null,
  tips: ["Retirer du cash à Haneda avant de partir."],
  sections: [
    { id: "matin", items: [
      { t: "Senso-ji temple", sub: "Le plus vieux temple de Tokyo" },
      { t: "Rickshaw à Asakusa", sub: "EBISUYA ou Tokyo RICKSHAW" },
    ]},
    { id: "soir", items: [
      { t: "Dîner Hoppy Street", sub: "Izakaya Kamiya — essayer le Denki Bran" },
    ]},
  ],
};

describe("matchesQuery", () => {
  it("returns true when query is empty", () => {
    expect(matchesQuery(day, "")).toBe(true);
  });

  it("matches by title", () => {
    expect(matchesQuery(day, "Haneda")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(matchesQuery(day, "SENSO-JI")).toBe(true);
  });

  it("matches by item title", () => {
    expect(matchesQuery(day, "rickshaw")).toBe(true);
  });

  it("matches by item subtitle (not just title)", () => {
    expect(matchesQuery(day, "Denki Bran")).toBe(true);
  });

  it("matches by city name", () => {
    expect(matchesQuery(day, "Tokyo")).toBe(true);
  });

  it("matches by date", () => {
    expect(matchesQuery(day, "27 avr")).toBe(true);
  });

  it("matches by day-of-week label", () => {
    expect(matchesQuery(day, "Lun")).toBe(true);
  });

  it("matches by tips", () => {
    expect(matchesQuery(day, "cash")).toBe(true);
  });

  it("returns false when nothing matches", () => {
    expect(matchesQuery(day, "kyoto")).toBe(false);
  });

  it("tolerates days with no sections or tips", () => {
    expect(matchesQuery({ title: "x", sections: [] }, "x")).toBe(true);
    expect(matchesQuery({ title: "x", sections: [] }, "y")).toBe(false);
  });

  it("returns false for a null day", () => {
    expect(matchesQuery(null, "anything")).toBe(false);
  });
});

describe("countMatches", () => {
  const days = [day, { ...day, n: 2, title: "Akihabara" }, { ...day, n: 3, title: "Kyoto day" }];

  it("returns 0 when query is empty", () => {
    expect(countMatches(days, "")).toBe(0);
  });

  it("counts days whose content includes the query", () => {
    expect(countMatches(days, "Akihabara")).toBe(1);
  });

  it("returns total when query appears everywhere", () => {
    // "rickshaw" appears in every entry (same sections)
    expect(countMatches(days, "rickshaw")).toBe(3);
  });
});

describe("countItemMatches", () => {
  it("counts activity items whose title or subtitle match", () => {
    expect(countItemMatches(day, "rickshaw")).toBe(1);
  });

  it("counts across all sections of the day", () => {
    expect(countItemMatches(day, "temple")).toBeGreaterThanOrEqual(1);
  });

  it("returns 0 for empty query", () => {
    expect(countItemMatches(day, "")).toBe(0);
  });

  it("handles missing sections gracefully", () => {
    expect(countItemMatches({}, "x")).toBe(0);
    expect(countItemMatches(null, "x")).toBe(0);
  });
});
