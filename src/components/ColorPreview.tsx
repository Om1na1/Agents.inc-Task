import { formatRgb, getPreviewCss, getSrgbCss, isInSrgb } from '../lib/color'
import type { OklchColor } from '../types/color'

interface ColorPreviewProps {
  color: OklchColor
}

export function ColorPreview({ color }: ColorPreviewProps) {
  const inGamut = isInSrgb(color)
  const previewCss = getPreviewCss(color)
  const srgbCss = getSrgbCss(color)

  return (
    <div className="color-preview">
      <div
        className="preview-swatch primary"
        style={{ backgroundColor: previewCss }}
        aria-label="Selected color preview"
      />

      {!inGamut && (
        <div className="preview-fallback">
          <div
            className="preview-swatch secondary"
            style={{ backgroundColor: srgbCss }}
            aria-label="sRGB fallback preview"
          />
          <p className="preview-caption">sRGB fallback</p>
        </div>
      )}

      <p className="preview-rgb">{formatRgb(color)}</p>
    </div>
  )
}
