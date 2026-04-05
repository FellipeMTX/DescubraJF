import { CircleHelp } from "lucide-react";

export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button type="button" className="cursor-help text-accent-400 hover:text-accent-500 focus:outline-none">
        <CircleHelp size={14} />
      </button>
      <span className="pointer-events-none absolute top-full left-0 z-50 mt-2 w-64 rounded-lg bg-primary-800 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        {text}
        <span className="absolute bottom-full left-3 border-4 border-transparent border-b-primary-800" />
      </span>
    </span>
  );
}
