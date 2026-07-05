/**
 * Public Layout — route group layout
 * Wraps Homepage, Level Test, Learn, Practice, Exams, Resources.
 * Renders the shared Navbar (minimal navigation sprint — see
 * components/nav/Navbar.tsx for scope/exclusion reasoning).
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
