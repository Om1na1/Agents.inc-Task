import {
  converter,
  formatCss,
  inGamut,
  parse,
  toGamut,
  type Oklch,
  type Rgb,
} from 'culori'
import { DEFAULT_COLOR, type OklchColor } from '../types/color'

const GAMUT_EPSILON = 1e-4
const ACHROMATIC_CHROMA = 1e-8

const toOklch = converter('oklch')
const toRgb = converter('rgb')
const toP3 = converter('p3')

function normalizeHue(h: number | undefined): number {
  if (h === undefined || Number.isNaN(h)) return 0
  return ((h % 360) + 360) % 360
}

function normalizeAlpha(alpha: number | undefined): number {
  if (alpha === undefined || Number.isNaN(alpha)) return 1
  return Math.min(1, Math.max(0, alpha))
}

export function toCuloriOklch(color: OklchColor): Oklch {
  const c = color.c < ACHROMATIC_CHROMA ? 0 : color.c
  const h = color.c < ACHROMATIC_CHROMA ? undefined : normalizeHue(color.h)

  return {
    mode: 'oklch',
    l: color.l,
    c,
    h,
    alpha: color.alpha,
  }
}

export function fromCuloriOklch(parsed: Oklch): OklchColor {
  return {
    l: parsed.l ?? DEFAULT_COLOR.l,
    c: parsed.c ?? 0,
    h: normalizeHue(parsed.h),
    alpha: normalizeAlpha(parsed.alpha),
  }
}

export function parseColor(input: string): OklchColor | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const parsed = parse(trimmed)
  if (!parsed) return null

  const oklch = toOklch(parsed)
  if (!oklch || oklch.l === undefined) return null

  return fromCuloriOklch(oklch)
}

export function formatOklch(color: OklchColor): string {
  const oklch = toCuloriOklch(color)
  const lPercent = (oklch.l * 100).toFixed(1).replace(/\.0$/, '')
  const c = oklch.c.toFixed(3).replace(/\.?0+$/, '')
  const h = oklch.h !== undefined ? oklch.h.toFixed(1).replace(/\.0$/, '') : '0'
  const alphaPercent = (color.alpha * 100).toFixed(0)

  if (color.alpha < 1) {
    return `oklch(${lPercent}% ${c} ${h} / ${alphaPercent}%)`
  }

  return `oklch(${lPercent}% ${c} ${h})`
}

export function formatRgb(color: OklchColor): string {
  const mapped = getSrgbFallback(color)
  if (!mapped) return 'rgb(0 0 0)'

  const r = Math.round((mapped.r ?? 0) * 255)
  const g = Math.round((mapped.g ?? 0) * 255)
  const b = Math.round((mapped.b ?? 0) * 255)
  const alpha = mapped.alpha ?? 1

  if (alpha < 1) {
    const alphaPercent = (alpha * 100).toFixed(0)
    return `rgb(${r} ${g} ${b} / ${alphaPercent}%)`
  }

  return `rgb(${r} ${g} ${b})`
}

export function isInSrgb(color: OklchColor): boolean {
  const oklch = toCuloriOklch(color)
  const inSrgb = inGamut('rgb')(oklch)
  if (inSrgb) return true

  const rgb = toRgb(oklch)
  if (!rgb) return false

  const channels = [rgb.r ?? 0, rgb.g ?? 0, rgb.b ?? 0]
  return channels.every((channel) => channel >= -GAMUT_EPSILON && channel <= 1 + GAMUT_EPSILON)
}

export function getSrgbFallback(color: OklchColor): Rgb | null {
  const oklch = toCuloriOklch(color)
  const mapped = toGamut('rgb', 'oklch')(oklch)
  return mapped ?? null
}

export function getWideGamutCss(color: OklchColor): string {
  const oklch = toCuloriOklch(color)
  const p3 = toP3(oklch)
  if (!p3) return formatOklch(color)

  return formatCss({ ...p3, alpha: color.alpha })
}

export function getSrgbCss(color: OklchColor): string {
  const mapped = getSrgbFallback(color)
  if (!mapped) return 'rgb(0 0 0)'

  return formatCss(mapped)
}

export function getPreviewCss(color: OklchColor): string {
  if (isInSrgb(color)) {
    return getSrgbCss(color)
  }

  return getWideGamutCss(color)
}

export function getMaxChroma(l: number, h: number, max = 0.4): number {
  let low = 0
  let high = max

  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2
    const testColor: OklchColor = { l, c: mid, h, alpha: 1 }

    if (isInSrgb(testColor)) {
      low = mid
    } else {
      high = mid
    }
  }

  return Math.max(0.001, low)
}

export function clampColor(color: OklchColor): OklchColor {
  const maxC = getMaxChroma(color.l, color.h)

  return {
    l: Math.min(1, Math.max(0, color.l)),
    c: Math.min(maxC, Math.max(0, color.c)),
    h: normalizeHue(color.h),
    alpha: normalizeAlpha(color.alpha),
  }
}
