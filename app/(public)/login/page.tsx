/**
 * app/(public)/login/page.tsx
 *
 * Minimal, honest placeholder — no real authentication exists yet.
 * Exists specifically so the Navbar's Login link never 404s (see the
 * earlier middleware/routing incident: a nav item pointing at a page
 * that doesn't exist is worse than not having the item at all).
 */
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPlaceholderPage() {
  return (
    <main className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="text-caption mb-3">Login</p>
      <h1 className="text-h1 mb-4">Accounts are coming soon.</h1>
      <p className="text-body text-ink-soft mb-8">
        CamPath doesn't require an account yet — your Placement Test
        results and progress are saved on this device.
      </p>
      <Link href="/level-test">
        <Button variant="primary" size="lg">Start Placement Test</Button>
      </Link>
    </main>
  );
}
