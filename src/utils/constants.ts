export const STORAGE_KEYS = {
  BLENDS: 'spiceBlends',
} as const;

export const DISPLAY_LIMITS = {
  SPICES: 5,
  BLENDS: 3,
} as const;

export const VALIDATION = {
  MIN_SPICES: 2,
  MIN_BLENDS: 1,
  MAX_HEAT_LEVEL: 5,
  MAX_PRICE_LEVEL: 5,
} as const;

export const PRICE_LEVELS = {
  MIN: 1,
  MAX: 5,
  SYMBOLS: {
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$',
    5: '$$$$$',
  },
} as const;

export const HEAT_LEVELS = {
  MIN: 0,
  MAX: 5,
  LABELS: {
    0: 'No Heat',
    1: '🔥',
    2: '🔥🔥',
    3: '🔥🔥🔥',
    4: '🔥🔥🔥🔥',
    5: '🔥🔥🔥🔥🔥',
  },
} as const;
