import React from "react";
import { cn } from "../lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card (base)
 *
 * Technical Reasoning: every other card variant below composes this
 * one rather than duplicating border/radius/shadow rules — a single
 * source of truth for the "flat, quiet surface" look defined in the
 * Design System (Section 4).
 */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cn("card", className)} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export interface MetricCardProps {
  icon?: React.ReactNode;
  eyebrow: string;
  value: string;
  trend?: string;
  className?: string;
}

/**
 * MetricCard
 *
 * UX Reasoning: used for any single-number insight (study time, units
 * completed, etc.). The value is always rendered in the mono/data
 * typeface (`card-value` maps to --font-mono) — a deliberate signal
 * that this number is real, measured data, not a game score.
 */
export function MetricCard({ icon, eyebrow, value, trend, className }: MetricCardProps) {
  return (
    <Card className={className}>
      {icon && (
        <div className="mb-3 h-6 w-6 text-pine" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="card-eyebrow">{eyebrow}</p>
      <p className="card-value">{value}</p>
      {trend && <p className="card-trend">{trend}</p>}
    </Card>
  );
}

/* ------------------------------------------------------------------ */

export interface LearningCardProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * LearningCard
 *
 * Product Reasoning: represents a Unit, Lesson, or Practice set inside
 * `/learn` and `/practice`. Deliberately text-forward (title +
 * description) rather than thumbnail-forward — CamPath sells clarity
 * of curriculum, not visual novelty per card.
 */
export function LearningCard({
  title,
  description,
  badge,
  actionLabel = "Open",
  onAction,
  className,
}: LearningCardProps) {
  return (
    <Card className={className}>
      {badge && <div className="mb-2">{badge}</div>}
      <h3 className="text-h3 mb-1">{title}</h3>
      <p className="text-small text-ink-soft mb-4">{description}</p>
      {onAction && (
        <button className="btn btn-tertiary btn-sm p-0" onClick={onAction}>
          {actionLabel} →
        </button>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */

export interface ClickableCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * ClickableCard
 *
 * Accessibility: rendered as a real <button>, not a <div onClick>, so
 * it is keyboard-focusable and announced as interactive by screen
 * readers without extra ARIA. Hover/focus feedback is limited to a
 * border-color change (see globals.css `.card:hover`) — no scale or
 * shadow-lift, consistent with the "no reward-feeling interactions"
 * principle from the Manifesto.
 */
export function ClickableCard({ className, children, ...rest }: ClickableCardProps) {
  return (
    <button
      className={cn(
        "card text-left w-full cursor-pointer",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
