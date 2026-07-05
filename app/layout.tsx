import "./globals.css";

/**
 * Root layout — shared by every route group.
 * Route-group-specific layouts (public/auth/teacher/internal) add
 * their own navbar variants on top of this; this file only sets
 * global <html>/<body> and font loading.
 */
export const metadata = {
  title: "CamPath",
  description: "Your personalised path to Cambridge fluency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
