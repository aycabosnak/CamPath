import "./globals.css";
import { SyncAgent } from "@/components/auth/SyncAgent";

/**
 * Root layout — shared by every route group.
 *
 * The disclaimer that used to live directly here now lives inside
 * components/nav/Footer.tsx instead (see that file for why) — the
 * new rich Footer is mounted in (public)/layout.tsx and
 * (auth)/layout.tsx, not here, so it stays out of (teacher) and
 * (internal), matching how Navbar is scoped.
 */
export const metadata = {
  title: "CamPath",
  description: "Your personalised path to Cambridge-style English fluency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SyncAgent />
        {children}
      </body>
    </html>
  );
}
