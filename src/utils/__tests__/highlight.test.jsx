import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { highlight } from "../highlight.jsx";

describe("highlight", () => {
  it("returns the original text when query is empty", () => {
    expect(highlight("hello", "", false)).toBe("hello");
  });

  it("returns the original text when no match is found", () => {
    expect(highlight("hello", "zz", false)).toBe("hello");
  });

  it("wraps the matched segment in a <mark>", () => {
    const { container } = render(<>{highlight("Bonjour Tokyo", "tokyo", false)}</>);
    const mark = container.querySelector("mark");
    expect(mark).not.toBeNull();
    expect(mark.textContent).toBe("Tokyo");
  });

  it("preserves the exact case of the source text inside the mark", () => {
    const { container } = render(<>{highlight("BONJOUR", "bonjour", false)}</>);
    expect(container.querySelector("mark").textContent).toBe("BONJOUR");
  });

  it("uses a darker highlight background in dark mode", () => {
    const { container: light } = render(<>{highlight("x", "x", false)}</>);
    const { container: dark } = render(<>{highlight("x", "x", true)}</>);
    const lightBg = light.querySelector("mark").style.background;
    const darkBg = dark.querySelector("mark").style.background;
    expect(lightBg).not.toBe(darkBg);
  });
});
