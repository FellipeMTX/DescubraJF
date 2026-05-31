type Props = {
  title: string;
  className?: string;
};

export function SectionTitle({ title, className }: Props) {
  return (
    <div className={className}>
      <h2
        className="m-0 text-[13px] font-bold uppercase tracking-[0.12em]"
        style={{ color: "var(--color-bl-prog-ink)" }}
      >
        {title}
      </h2>
      <div
        className="mt-2 h-[2px] w-10 rounded-full"
        style={{ background: "var(--color-bl-prog-accent)" }}
      />
    </div>
  );
}
