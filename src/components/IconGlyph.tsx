import { Fragment } from "react";

export type GlyphName = "up-right" | "right" | "left" | "up" | "down" | "check" | "close";

const CHAR_TO_GLYPH: Record<string, GlyphName> = {
  "↗": "up-right",
  "→": "right",
  "←": "left",
  "↑": "up",
  "↓": "down",
  "✓": "check",
  "✕": "close",
};

const GLYPH_TEST_RE = /[↗→←↑↓✓✕]/;
const GLYPH_SPLIT_RE = /([↗→←↑↓✓✕])/g;

/**
 * Architectural inline SVG glyphs — prevents iOS Safari / Apple Color Emoji
 * from turning Unicode arrows (especially ↗, →, ↓, ↑, ✓) into blue/colored emojis.
 */
export function IconGlyph({
  name,
  className = "",
}: {
  name: GlyphName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={`inline-block w-[0.9em] h-[0.9em] align-[-0.12em] shrink-0 ${className}`.trim()}
    >
      {name === "up-right" && <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />}
      {name === "right" && <path d="M2.5 8H13M8.75 3.75L13 8L8.75 12.25" />}
      {name === "left" && <path d="M13.5 8H3M7.25 3.75L3 8L7.25 12.25" />}
      {name === "down" && <path d="M8 2.5V13M3.75 8.75L8 13L12.25 8.75" />}
      {name === "up" && <path d="M8 13.5V3M3.75 7.25L8 3L12.25 7.25" />}
      {name === "check" && <path d="M3 8.5L6.5 12L13.5 4.5" />}
      {name === "close" && <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" />}
    </svg>
  );
}

/**
 * Renders text while replacing any Unicode arrow/check/close glyphs
 * with crisp inline SVG vectors so iPhone/iOS never renders them as emojis.
 */
export function RichText({ text }: { text: string }) {
  if (!GLYPH_TEST_RE.test(text)) {
    return <>{text}</>;
  }
  const parts = text.split(GLYPH_SPLIT_RE);
  return (
    <>
      {parts.map((part, idx) => {
        const glyph = CHAR_TO_GLYPH[part];
        return (
          <Fragment key={idx}>
            {glyph ? <IconGlyph name={glyph} /> : part}
          </Fragment>
        );
      })}
    </>
  );
}
