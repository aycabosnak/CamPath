/**
 * Authenticated Student Layout — route group layout
 * Renders the same shared Navbar and Footer as (public).
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
