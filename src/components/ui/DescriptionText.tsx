import { cn } from "@/lib/utils";

// Most descriptions separate paragraphs with a blank line, but some legacy
// content is hard-wrapped (a line break at every line). This splits the text
// into real paragraphs in both cases, so spacing is applied per paragraph —
// not per wrapped line.
const HARD_WRAP_MAX_LINE = 60;

function toParagraphs(text: string): string[] {
  const paragraphs: string[] = [];

  for (const block of text.split(/\n\s*\n/)) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    const longestLine = Math.max(...lines.map((line) => line.length));
    const hardWrapped = lines.length > 1 && longestLine < HARD_WRAP_MAX_LINE;

    if (!hardWrapped) {
      paragraphs.push(...lines);
      continue;
    }

    // Rejoin wrapped lines into flowing text; a noticeably short line marks
    // the end of a paragraph.
    let current: string[] = [];
    for (const line of lines) {
      current.push(line);
      if (line.length < longestLine * 0.66) {
        paragraphs.push(current.join(" "));
        current = [];
      }
    }
    if (current.length > 0) paragraphs.push(current.join(" "));
  }

  return paragraphs;
}

/**
 * Renders a plain-text description as separate paragraphs with spacing.
 */
export function DescriptionText({
  text,
  className,
}: {
  text?: string | null;
  className?: string;
}) {
  const paragraphs = toParagraphs(text ?? "");
  if (paragraphs.length === 0) return null;

  return (
    <div className={cn("space-y-3 text-justify text-sm leading-relaxed text-primary-700", className)}>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
