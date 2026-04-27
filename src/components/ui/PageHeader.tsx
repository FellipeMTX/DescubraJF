type PageHeaderProps = {
  kicker?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
};

export function PageHeader({ kicker, title, highlight, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-10">
      {kicker && (
        <div className="bl-kicker mb-5">
          <span className="dot" /> {kicker}
        </div>
      )}
      <h1
        className="bl-display m-0"
        style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="bl-em">{highlight}</span>
          </>
        )}
      </h1>
      {subtitle && (
        <p
          className="mt-4 max-w-2xl text-base leading-[1.7]"
          style={{ color: "var(--color-bl-muted)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
