export const BACKGROUND_TYPES = ['color', 'gradient', 'image'] as const;
export type BackgroundType = typeof BACKGROUND_TYPES[number];

export const VISIBILITY_OPTIONS = ['private', 'workspace', 'public'] as const;
export type VisibilityOption = typeof VISIBILITY_OPTIONS[number];
