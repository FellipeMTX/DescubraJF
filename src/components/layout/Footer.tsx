import { Link } from "react-router";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants";

type NavItem =
  | { label: string; href: string; children?: undefined }
  | { label: string; children: ReadonlyArray<{ label: string; href: string }>; href?: undefined };

export function Footer() {
  return (
    <footer
      className="px-14 pt-20 pb-10"
      style={{ background: "var(--color-bl-card)", color: "var(--color-bl-ink)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-black/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="bl-display mb-2 text-[38px]">
              Juiz de <span className="bl-em">Fora</span>
            </div>
            <div
              className="text-[11px] uppercase tracking-widest"
              style={{ color: "var(--color-bl-muted)" }}
            >
              Secretaria de Turismo
            </div>
            <p
              className="mt-6 max-w-[320px] italic leading-[1.6] text-sm"
              style={{
                color: "var(--color-bl-muted)",
                fontFamily: "var(--font-display)",
              }}
            >
              "A vida na montanha." Descubra as Geraes em sua cidade mais
              acolhedora.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
                <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.facebook} label="Facebook">
                <path d="M18.768 7.465H14.5V5.56c0-.896.594-1.105 1.012-1.105s2.988 0 2.988 0V.513L14.171.5C10.244.5 9.5 3.438 9.5 5.32v2.145h-3v4h3c0 5.212 0 12 0 12h5c0 0 0-6.85 0-12h3.851L18.768 7.465z" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.youtube} label="YouTube">
                <path d="M19.67 8.14c-.089-.343-.267-.656-.517-.907a2.08 2.08 0 00-.903-.43C16.176 6.465 14.088 6.355 12 6.38c-2.088-.025-4.176.085-6.25.33a2.08 2.08 0 00-.903.43 2.08 2.08 0 00-.517.907C4.103 9.414 3.992 10.706 4 12c-.008 1.301.102 2.599.33 3.88.093.337.274.644.523.89.25.245.559.425.897.51 2.074.245 4.162.355 6.25.33 2.088.025 4.176-.085 6.25-.33a2.08 2.08 0 00.897-.51c.249-.246.43-.553.523-.89.227-1.281.338-2.579.33-3.88.008-1.294-.103-2.586-.33-3.86zM10.36 14.39V9.63L14.55 12l-4.19 2.39z" />
              </SocialIcon>
            </div>
          </div>
          {(NAV_ITEMS as readonly NavItem[]).map((item) => (
            <div key={item.label}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest">
                {item.label}
              </div>
              {item.children ? (
                item.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className="mb-2 block text-[13px]"
                    style={{ color: "var(--color-bl-muted)" }}
                  >
                    {child.label}
                  </Link>
                ))
              ) : item.href ? (
                <Link
                  to={item.href}
                  className="block text-[13px]"
                  style={{ color: "var(--color-bl-muted)" }}
                >
                  Ir para {item.label}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
        <div
          className="flex justify-between pt-8 text-xs"
          style={{ color: "var(--color-bl-muted)" }}
        >
          <div>© {new Date().getFullYear()} Prefeitura de Juiz de Fora · MG</div>
          <div
            className="italic"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Feito com ☕ nas Geraes
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
      style={{
        background: "var(--color-bl-bg)",
        color: "var(--color-bl-ink)",
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        {children}
      </svg>
    </a>
  );
}
