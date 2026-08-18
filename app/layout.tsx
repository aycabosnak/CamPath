import "./globals.css";
import { IBM_Plex_Mono, Newsreader, Source_Sans_3 } from "next/font/google";

const displayFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: false,
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const dataFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

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
      <body className={`${displayFont.variable} ${bodyFont.variable} ${dataFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
