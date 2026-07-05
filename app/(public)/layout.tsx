/**
 * Public Layout — route group layout
 * Wraps Homepage, Level Test, Learn, Practice, Exams, Resources.
 * Renders the shared Navbar and Footer.
 */
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/nav/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
