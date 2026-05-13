import { cn } from "@/lib/utils";

type Props = {
  value: number;
  size?: number;
  className?: string;
  color?: string;
};

export function StarRating({ value, size = 14, className, color }: Props) {
  return (
    <div className={cn("flex gap-px", className)} aria-label={`${value} estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <HalfStar key={i} fill={fill} size={size} color={color} />
        );
      })}
    </div>
  );
}

function HalfStar({ fill, size, color }: { fill: number; size: number; color?: string }) {
  const id = `hsg-${Math.round(fill * 10)}`;
  const filled = color ?? "currentColor";
  const empty = "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fill * 100}%`} stopColor={filled} />
          <stop offset={`${fill * 100}%`} stopColor={empty} />
        </linearGradient>
      </defs>
      {/* empty star outline */}
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke={filled}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* filled portion via gradient */}
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={`url(#${id})`}
      />
    </svg>
  );
}
