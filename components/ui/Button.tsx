import React from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Button
 *
 * Product Reasoning: CamPath has exactly three levels of visual weight
 * for actions (primary / secondary / tertiary) — no more. Extra variants
 * (e.g. bright "danger"/"success" colors) would pull in hues outside the
 * approved token set, so they are deliberately not offered here.
 *
 * Accessibility: disabled uses both the visual style AND the native
 * `disabled` attribute (never a CSS-only fake-disabled look), so
 * assistive tech announces it correctly and it's excluded from tab order.
 * Focus-visible styling is inherited globally from globals.css — no
 * component should ever override or remove it.
 */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : "btn-tertiary";

  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      type={type}
      className={cn("btn", variantClass, sizeClass, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
