"use client";

/**
 * components/nav/Navbar.tsx
 *
 * Minimal navigation for CamPath's core learner flow.
 *
 * "Tests" was added in the Tests Architecture sprint (Step 2), now
 * that /tests is fully implemented — per the rule that nav items are
 * only added once their destination route actually works.
 *
 * "Lessons" is still intentionally NOT included — /learn is still an
 * empty scaffold stub. It'll be added the moment that page ships.
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
  { label: "Tests", href: "/tests", match: (path: string) => path.startsWith("/tests") },
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
