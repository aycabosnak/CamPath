/**
 * Authenticated Student Layout — route group layout
 * Renders the same shared Navbar as (public) — My Journey is one of
 * the five core links, so students need the same nav here too.
 */
import { Navbar } from "@/components/nav/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
