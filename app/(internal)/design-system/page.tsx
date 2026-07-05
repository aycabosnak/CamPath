/**
 * Route entry for the internal Design System preview.
 * Actual content lives in `_preview.tsx` (underscore-prefixed so
 * Next.js never treats it as a routable segment on its own —
 * this file is the only real route here, and middleware.ts blocks
 * it in production builds).
 */
import DesignSystemPreview from "./_preview";

export default function Page() {
  return <DesignSystemPreview />;
}
