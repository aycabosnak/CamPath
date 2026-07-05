"use client";

/**
 * components/nav/Navbar.tsx
 *
 * Minimal navigation for CamPath's core learner flow. Deliberately
 * covers only routes that are fully implemented today — Teacher,
 * Resources, Exams, and Account are excluded on purpose, not by
 * oversight (see the production-readiness audit: those are unfinished
 * scaffold pages with no real content yet).
 *
 * "Practice" points at /practice/weakest-skill rather than the
 * /practice hub, because the hub itself is still an empty scaffold
 * placeholder — linking to it would recreate the exact "user feels
 * lost" problem this navbar exists to prevent.
 *
 * No dropdowns, no mobile hamburger drawer — at five links, a plain
 * flex-wrap row stays legible at every width without introducing a
 * new interaction pattern.
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
    </nav>
  );
}
