import { DEFAULT_COLOR, type OklchColor } from '../types/color'

const HASH_PATTERN = /^#?(\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)$/

export function parseHash(hash: string): OklchColor | null {
  const normalized = hash.startsWith('#') ? hash : `#${hash}`
  const match = normalized.match(HASH_PATTERN)

  if (!match) return null

  let l = parseFloat(match[1])
  const c = parseFloat(match[2])
  const h = parseFloat(match[3])
  const alphaPercent = parseFloat(match[4])

  if ([l, c, h, alphaPercent].some((value) => Number.isNaN(value))) {
    return null
  }

  if (l > 1) l /= 100

  return {
    l: Math.min(1, Math.max(0, l)),
    c: Math.max(0, c),
    h: ((h % 360) + 360) % 360,
    alpha: Math.min(1, Math.max(0, alphaPercent / 100)),
  }
}

export function serializeHash(color: OklchColor): string {
  const alphaPercent = Math.round(color.alpha * 100)
  return `#${color.l},${color.c},${color.h},${alphaPercent}`
}

export function getColorFromUrl(): OklchColor {
  if (typeof window === 'undefined') return DEFAULT_COLOR

  const parsed = parseHash(window.location.hash)
  return parsed ?? DEFAULT_COLOR
}

export function writeHashToUrl(hash: string): void {
  if (typeof window === 'undefined') return
  if (window.location.hash === hash) return

  const url = `${window.location.pathname}${window.location.search}${hash}`
  window.history.replaceState(null, '', url)
}
