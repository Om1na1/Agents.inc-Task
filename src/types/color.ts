export interface OklchColor {
  l: number
  c: number
  h: number
  alpha: number
}

export type ColorChannel = keyof OklchColor

export const DEFAULT_COLOR: OklchColor = {
  l: 0.7,
  c: 0.15,
  h: 240,
  alpha: 1,
}

export const CHANNEL_RANGES: Record<
  ColorChannel,
  { min: number; max: number; step: number; label: string }
> = {
  l: { min: 0, max: 1, step: 0.001, label: 'Lightness' },
  c: { min: 0, max: 0.4, step: 0.001, label: 'Chroma' },
  h: { min: 0, max: 360, step: 0.1, label: 'Hue' },
  alpha: { min: 0, max: 1, step: 0.01, label: 'Alpha' },
}
