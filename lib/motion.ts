/**
 * Framer Motion animation constants and reusable variants.
 *
 * Centralizes all timing, easing, and variant definitions so motion behavior
 * stays consistent across the application.
 */

/** Slight overshoot — gives entrances a bouncy, organic feel. */
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

/** Smooth ease-out — the default for most transitions. */
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

/** Ease-in — used for elements leaving the viewport. */
export const EASE_EXIT = [0.4, 0, 1, 1] as const;

/** Duration values in milliseconds (for CSS transitions). */
export const DURATIONS = {
  instant: 150,
  quick: 280,
  medium: 420,
  slow: 600,
} as const;

/** Duration values in seconds (for Framer Motion). */
export const DURATIONS_S = {
  instant: 0.15,
  quick: 0.28,
  medium: 0.42,
  slow: 0.6,
} as const;

/** Stagger delays between child element entrances. */
export const STAGGER = {
  tight: 0.04,
  normal: 0.06,
  wide: 0.12,
} as const;

// ── Reusable Framer Motion Variants ─────────────────────────────────────────

/** Staggered entrance for page-level section groups. */
export const pageEntranceContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER.normal,
    },
  },
};

/** Individual item within a staggered entrance group. */
export const pageEntranceItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS_S.medium,
      ease: EASE_SMOOTH,
    },
  },
};

/** Card lift on hover. */
export const cardVariants = {
  rest: {
    y: 0,
    transition: { duration: DURATIONS_S.quick, ease: EASE_SMOOTH },
  },
  peek: {
    y: -3,
    transition: { duration: DURATIONS_S.quick, ease: EASE_SMOOTH },
  },
};

/** Expandable peek panel that slides into view on hover. */
export const peekPanelVariants = {
  rest: {
    opacity: 0,
    y: 8,
    height: 0,
    transition: { duration: 0.18, ease: EASE_EXIT },
  },
  peek: {
    opacity: 1,
    y: 0,
    height: "auto" as const,
    transition: { duration: DURATIONS_S.quick, ease: EASE_SMOOTH },
  },
};

/** Subtle scale on hover for image thumbnails. */
export const thumbnailVariants = {
  rest: {
    scale: 1,
    transition: { duration: DURATIONS_S.quick, ease: EASE_SMOOTH },
  },
  peek: {
    scale: 1.04,
    transition: { duration: DURATIONS_S.quick, ease: EASE_SMOOTH },
  },
};
