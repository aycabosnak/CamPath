import "./globals.css";

/**
 * Root layout — shared by every route group.
 *
 * The disclaimer footer here is a direct response to Design Review
 * Report Finding #9 (Cambridge Assessment Academic Director): CamPath
 * uses Cambridge exam names and exam-readiness language without any
 * official affiliation. This notice is site-wide, not just on one
 * page, because the naming appears throughout the product.
 */
export const metadata = {
  title: "CamPath",
  description: "Your personalised path to Cambridge-style English fluency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer style={{ borderTop: "1px solid var(--color-line)", padding: "24px", marginTop: "64px" }}>
          <p className="text-caption normal-case" style={{ maxWidth: 720, margin: "0 auto" }}>
            CamPath is an independent learning platform and is not affiliated with or
            endorsed by Cambridge University Press &amp; Assessment.
          </p>
        </footer>
      </body>
    </html>
  );
}
