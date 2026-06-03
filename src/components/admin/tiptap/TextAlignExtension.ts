import { Extension } from "@tiptap/core";

type Alignment = "left" | "center" | "right" | "justify";

const ALIGNMENTS: Alignment[] = ["left", "center", "right", "justify"];
const TYPES = ["paragraph", "heading"];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textAlign: {
      setTextAlign: (alignment: Alignment) => ReturnType;
      unsetTextAlign: () => ReturnType;
    };
  }
}

export const TextAlignExtension = Extension.create({
  name: "textAlign",

  addGlobalAttributes() {
    return [
      {
        types: TYPES,
        attributes: {
          textAlign: {
            default: null as Alignment | null,
            parseHTML: (el) => {
              const value = (el as HTMLElement).style.textAlign as Alignment;
              return ALIGNMENTS.includes(value) ? value : null;
            },
            renderHTML: (attrs) =>
              attrs.textAlign ? { style: `text-align: ${attrs.textAlign}` } : {},
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextAlign:
        (alignment: Alignment) =>
        ({ commands }) => {
          if (!ALIGNMENTS.includes(alignment)) return false;
          return TYPES.every((type) =>
            commands.updateAttributes(type, { textAlign: alignment }),
          );
        },
      unsetTextAlign:
        () =>
        ({ commands }) => {
          return TYPES.every((type) => commands.resetAttributes(type, "textAlign"));
        },
    };
  },
});
