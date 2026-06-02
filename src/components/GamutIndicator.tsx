import { isInSrgb } from '../lib/color'
import type { OklchColor } from '../types/color'

interface GamutIndicatorProps {
  color: OklchColor
}

export function GamutIndicator({ color }: GamutIndicatorProps) {
  const inGamut = isInSrgb(color)

  return (
    <div className={`gamut-indicator ${inGamut ? 'in-gamut' : 'out-of-gamut'}`} role="status">
      {inGamut ? (
        <>
          <span className="gamut-badge">In sRGB gamut</span>
          <p>This OKLCH color can be represented accurately in standard sRGB displays.</p>
        </>
      ) : (
        <>
          <span className="gamut-badge">Outside sRGB gamut</span>
          <p>
            This OKLCH value exceeds what sRGB can display. The wide-gamut preview uses
            display-p3 when available; the sRGB fallback uses CSS Color 4 chroma reduction.
          </p>
        </>
      )}
    </div>
  )
}
