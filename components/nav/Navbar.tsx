"use client";

/**
 * components/nav/Navbar.tsx
 *
 * Minimal navigation for CamPath's core learner flow. Deliberately
 * covers only routes that are fully implemented today.
 *
 * "Tests" and "Lessons" are intentionally NOT included yet — this is
 * Step 1 of a multi-step navigation expansion (Home/Navbar/Footer
 * first, Tests architecture next, Search after that). Adding those
 * links now would point at pages that don't exist yet (/tests doesn't
 * exist at all; /learn is still an empty scaffold stub) — exactly the
 * "broken promise" pattern fixed in the last production-readiness
 * pass. They'll be added here the moment their real pages ship.
 *
 * "Practice" points at /practice/weakest-skill rather than the
 * /practice hub, because the hub itself is still an empty scaffold
 * placeholder — linking to it would recreate the exact "user feels
 * lost" problem this navbar exists to prevent.
 *
 * No dropdowns, no mobile hamburger drawer — a plain flex-wrap row
 * stays legible at every width without introducing a new interaction
 * pattern. Login is visually separated (its own small pill) since
 * it's an account action, not a content destination like the rest.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/lib/cn";

const NAV_LINKS = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  { label: "Placement Test", href: "/level-test", match: (path: string) => path.startsWith("/level-test") },
  { label: "My Journey", href: "/my-journey", match: (path: string) => path.startsWith("/my-journey") },
  { label: "Practice", href: "/practice/weakest-skill", match: (path: string) => path.startsWith("/practice") },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="flex flex-wrap items-center justify-between gap-4"
      style={{
        borderBottom: "1px solid var(--color-line)",
        padding: "16px 24px",
      }}
    >
      <Link href="/" className="text-h3" style={{ fontFamily: "var(--font-display)" }}>
        CamPath
      </Link>

      <div className="flex flex-wrap items-center gap-6">
        <ul className="flex flex-wrap items-center gap-6" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_LINKS.map((link) => {
            const active = link.match(pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("text-small", active ? "text-pine font-semibold" : "text-ink-soft")}
                  style={{
                    display: "inline-block",
                    paddingBottom: "4px",
                    borderBottom: active ? "2px solid var(--color-pine)" : "2px solid transparent",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/login" className="btn btn-secondary btn-sm">
          Login
        </Link>
      </div>
    </nav>
  );
}
