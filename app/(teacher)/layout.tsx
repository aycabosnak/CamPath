/**
 * Teacher Layout — route group layout
 * Role-gated: middleware redirects non-teachers. Renders teacher-only navbar variant (Dashboard, Classes, Assignments — no Level Test CTA).
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
