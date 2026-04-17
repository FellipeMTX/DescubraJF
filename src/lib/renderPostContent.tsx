import { Fragment, type ReactNode } from "react";
import { Gallery } from "@/components/ui/Gallery";

export function renderPostContent(html: string): ReactNode {
  if (!html) return null;

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return <div dangerouslySetInnerHTML={{ __html: html }} />;

  const nodes: ReactNode[] = [];
  let buffer = "";
  let key = 0;

  const flushBuffer = () => {
    if (!buffer) return;
    nodes.push(
      <div key={`html-${key++}`} dangerouslySetInnerHTML={{ __html: buffer }} />
    );
    buffer = "";
  };

  Array.from(root.childNodes).forEach((node) => {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).matches?.("div[data-gallery]")
    ) {
      flushBuffer();
      const raw = (node as Element).getAttribute("data-images") ?? "[]";
      let images: string[] = [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) images = parsed.filter((u) => typeof u === "string");
      } catch {
        images = [];
      }
      nodes.push(<Gallery key={`gallery-${key++}`} images={images} />);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      buffer += (node as Element).outerHTML;
    } else if (node.nodeType === Node.TEXT_NODE) {
      buffer += node.textContent ?? "";
    }
  });

  flushBuffer();
  return <Fragment>{nodes}</Fragment>;
}
