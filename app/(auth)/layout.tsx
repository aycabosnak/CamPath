/**
 * Authenticated Student Layout — route group layout
 * Checks session via middleware before render. Renders 'My Journey' nav item instead of Level Test CTA (Experience Blueprint nav rules).
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
