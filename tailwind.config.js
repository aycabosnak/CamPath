/**
 * CamPath — Tailwind Theme Configuration
 * Design System v1.0 — "Progress over Points"
 *
 * This file translates the CamPath Design System spec into Tailwind theme
 * tokens. Written for Tailwind v3-style config (module.exports + extend).
 * If the project is on Tailwind v4, these same values map directly into
 * an `@theme { ... }` block in globals.css — see the note at the bottom
 * of globals.css.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        paper: {
          DEFAULT: "#F1F3F0",
          raised: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#16232C",
          soft: "#4B5A5F",
        },
        // Brand accent — primary interactive color
        pine: {
          DEFAULT: "#2F5D53",
          soft: "rgba(47,93,83,0.12)",
          hover: "#264D45",
        },
        // Reserved EXCLUSIVELY for mastery / certificates / milestones.
        // Do not use for buttons, links, or decorative accents.
        gold: {
          DEFAULT: "#A9762C",
          soft: "rgba(169,118,44,0.14)",
        },
        // Secondary / low-priority states ("in progress", "approaching")
        sage: {
          DEFAULT: "#6C8C87",
          soft: "rgba(108,140,135,0.14)",
        },
        // Functional warning ONLY (e.g. teacher "needs attention" flag,
        // form errors). Never used decoratively.
        brick: {
          DEFAULT: "#8C4A3B",
          soft: "rgba(140,74,59,0.12)",
        },
        line: "#DCE0D9",
      },
      fontFamily: {
        // Headings only (H1/H2/Display). Never body copy.
        display: ["Newsreader", "Georgia", "serif"],
        // Default body typeface for all long-form / UI text.
        body: ["'Source Sans 3'", "-apple-system", "sans-serif"],
        // Reserved for anything representing real, measured data:
        // scores, percentages, durations, dates. Never decorative.
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["56px", { lineHeight: "64px", fontWeight: "500" }],
        "display-l": ["40px", { lineHeight: "48px", fontWeight: "500" }],
        h1: ["32px", { lineHeight: "40px", fontWeight: "500" }],
        h2: ["24px", { lineHeight: "32px", fontWeight: "500" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-l": ["18px", { lineHeight: "28px" }],
        body: ["16px", { lineHeight: "24px" }],
        small: ["14px", { lineHeight: "20px" }],
        caption: ["12px", { lineHeight: "16px", letterSpacing: "0.02em" }],
      },
      spacing: {
        // Mirrors the 4px-based CamPath spacing scale.
        // Tailwind's default scale already covers most of this (4=1, 8=2 etc.)
        // These aliases exist so design docs and code share the same names.
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-6": "24px",
        "space-8": "32px",
        "space-12": "48px",
        "space-16": "64px",
        "space-24": "96px",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        chip: "6px",
        node: "12px", // Study Path node badges — rounded square, never circular
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,35,44,0.04)",
      },
      transitionTimingFunction: {
        // The ONLY easing curve used anywhere in CamPath.
        // No 'bounce', 'elastic', or spring curves — see Animation Principles.
        calm: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        micro: "200ms",
        section: "500ms",
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
