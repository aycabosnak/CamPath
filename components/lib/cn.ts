/**
 * Minimal classnames combinator — avoids pulling in a dependency
 * (e.g. clsx) for something this small. Falsy values are dropped.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
