"use client";

/** Primary learner navigation. Placement remains a prominent action,
 * while Learn / Tests / Practice describe distinct product jobs. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/lib/cn";

const NAV_LINKS = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  {
    label: "Learn",
    href: "/learn",
    match: (path: string) =>
      path.startsWith("/learn") ||
      (path.startsWith("/tests/") &&
        (path.includes("/lessons/") || path.split("/").filter(Boolean).length === 2)),
  },
  {
    label: "Tests",
    href: "/tests",
    match: (path: string) =>
      path === "/tests" ||
      (path.startsWith("/tests/") &&
        !path.includes("/lessons/") &&
        path.split("/").filter(Boolean).length >= 3),
  },
  { label: "Practice", href: "/practice", match: (path: string) => path.startsWith("/practice") },
  { label: "My Journey", href: "/my-journey", match: (path: string) => path.startsWith("/my-journey") },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="site-nav"
    >
      <div className="site-nav-inner">
        <Link href="/" className="site-brand" aria-label="CamPath home">
          CamPath
        </Link>

        <ul className="site-nav-links">
          {NAV_LINKS.map((link) => {
            const active = link.match(pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "site-nav-link text-small",
                    active ? "text-pine font-semibold" : "text-ink-soft"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/level-test"
          className={cn(
            "btn btn-sm",
            pathname.startsWith("/level-test") ? "btn-secondary" : "btn-primary"
          )}
          aria-current={pathname.startsWith("/level-test") ? "page" : undefined}
        >
          Placement Test
        </Link>
      </div>
    </nav>
  );
}
