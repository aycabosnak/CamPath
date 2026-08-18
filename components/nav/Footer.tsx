import Link from "next/link";
import { TEST_LEVELS } from "@/constants/testLevels";

const LEVELS = TEST_LEVELS.filter((level) => level.cefr !== null);
const PLATFORM_LINKS = [
  { label: "Learn", href: "/learn" },
  { label: "Tests", href: "/tests" },
  { label: "Practice", href: "/practice" },
  { label: "My Journey", href: "/my-journey" },
  { label: "Placement Test", href: "/level-test" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid gap-10 footer-grid">
          <div>
            <Link href="/" className="site-brand">CamPath</Link>
            <p className="text-small text-ink-soft mt-3 max-w-xs">
              Clear, level-based English learning and Cambridge-style exam preparation.
            </p>
          </div>

          <div>
            <p className="card-eyebrow mb-3">Learn by level</p>
            <ul className="footer-link-list">
              {LEVELS.map((level) => (
                <li key={level.slug}>
                  <Link href={`/tests/${level.slug}`} className="text-small text-ink-soft">
                    {level.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="card-eyebrow mb-3">Platform</p>
            <ul className="footer-link-list">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-small text-ink-soft">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-legal">
          <p className="text-caption normal-case mb-2">
            © {new Date().getFullYear()} CamPath. Progress is stored on this device.
          </p>
          <p className="text-caption normal-case">
            CamPath is an independent learning platform and is not affiliated with or
            endorsed by Cambridge University Press &amp; Assessment.
          </p>
        </div>
      </div>
    </footer>
  );
}
