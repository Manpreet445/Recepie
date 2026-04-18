// motion constants for the app
// I based these off of some framer motion examples I found
// and tweaked until they felt right

// slight overshoot — feels bouncy on entrances
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

// smooth ease-out — used for most transitions
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

// ease-in — for things leaving the screen
export const EASE_EXIT = [0.4, 0, 1, 1] as const;

// duration values in ms
export const DURATIONS = {
  instant: 150,
  quick: 280,
  medium: 420,
  slow: 600,
} as const;

// same but in seconds (framer motion uses seconds not ms)
export const DURATIONS_S = {
  instant: 0.15,
  quick: 0.28,
  medium: 0.42,
  slow: 0.6,
} as const;

// stagger delays between child elements
export const STAGGER = {
  tight: 0.04,
  normal: 0.06,
  wide: 0.12,
} as const;

// --- reusable framer motion variants ---

// staggered entrance for page sections
export const pageEntranceContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER.normal,
    },
  },
};

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

// card hover effect
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

// the panel that slides out on hover
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

// thumbnail zooms slightly on hover
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
