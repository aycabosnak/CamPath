/**
 * components/nav/Footer.tsx
 *
 * Full premium footer per the Home/Navigation expansion brief.
 *
 * Important scope note: "Levels" and "Info" columns list destinations
 * that don't exist yet (/tests/[level] ships in Step 2; About, FAQ,
 * Privacy, Terms etc. were never built — see the Phase 7 marketing
 * pages gap flagged earlier). Rendering these as real <Link>s would
 * 404. They're rendered as plain, non-interactive text for now —
 * visually complete, honestly non-clickable — and should become real
 * links the moment each destination page ships. "Get in Touch" is
 * placeholder contact information (no real business details exist
 * for this prototype) — also plain text, not functional mailto/tel
 * links, so nothing implies a real inbox or phone line exists.
 *
 * The disclaimer that used to live directly in app/layout.tsx now
 * lives here instead, since this Footer replaces that simpler one —
 * see (public)/layout.tsx and (auth)/layout.tsx for where it's mounted.
 */
import Link from "next/link";

const LEVELS = [
  "A1 Elementary",
  "A2 Pre-Intermediate",
  "B1 Intermediate",
  "B1+ Upper Intermediate",
  "B2 Pre-Advanced",
  "C1 Advanced",
  "Grammar Shorts",
];

const INFO_LINKS = ["About", "Cambridge Preparation", "UK Language School", "FAQ", "Privacy Policy", "Terms"];

const CONTACT_LINES = ["hello@campath.com", "+90 000 000 00 00", "Istanbul, Turkey"];
const SOCIAL_LINES = ["Instagram", "LinkedIn", "YouTube"];

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="card-eyebrow mb-3">{title}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((item) => (
          // Plain text, not <Link> — see file header. Styled to look
          // like a link so the footer reads as complete; not
          // interactive because there's nowhere real to send it yet.
          <li key={item} className="text-small text-ink-soft">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-line)", marginTop: "96px" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div
          className="grid gap-10 mb-12"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >
          <FooterColumn title="Levels" items={LEVELS} />
          <FooterColumn title="Info" items={INFO_LINKS} />
          <FooterColumn title="Get in Touch" items={[...CONTACT_LINES, ...SOCIAL_LINES]} />

          <div>
            <p className="card-eyebrow mb-3">Get Started</p>
            <div className="flex flex-col gap-3 items-start">
              <Link href="/level-test" className="btn btn-primary btn-sm">
                Take Placement Test
              </Link>
              <Link href="/my-journey" className="btn btn-secondary btn-sm">
                Start Learning
              </Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--color-line)", paddingTop: "24px" }}>
          <p className="text-caption normal-case mb-2">© {new Date().getFullYear()} CamPath. All rights reserved.</p>
          <p className="text-caption normal-case">
            CamPath is an independent learning platform and is not affiliated with or
            endorsed by Cambridge University Press &amp; Assessment.
          </p>
        </div>
      </div>
    </footer>
  );
}
