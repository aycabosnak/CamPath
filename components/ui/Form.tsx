import React, { useId } from "react";
import { cn } from "../lib/cn";

/**
 * Shared accessibility pattern for all three field types below:
 * - the visible <label> is always programmatically linked via htmlFor/id
 * - an error message, when present, is linked via aria-describedby and
 *   the input is marked aria-invalid — so screen reader users hear the
 *   error immediately when focusing the field, not just sighted users
 *   who can see the red text.
 */

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
}

export function TextField({ label, error, className, ...rest }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        className={cn("field", error && "field-error", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className="field-error-msg" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export function SelectField({
  label,
  options,
  error,
  className,
  ...rest
}: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        className={cn("field", error && "field-error", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="field-error-msg" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export interface TextareaFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: string;
  error?: string;
}

/**
 * TextareaField — used primarily for Writing task submissions.
 * Deliberately has no built-in AI feedback hook: per the approved
 * roadmap, AI Writing Feedback is Phase 2. This component only
 * captures and validates text; scoring/feedback is composed on top
 * of it later, not inside it.
 */
export function TextareaField({
  label,
  error,
  className,
  rows = 6,
  ...rest
}: TextareaFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={cn("field", "h-auto py-2", error && "field-error", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className="field-error-msg" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
