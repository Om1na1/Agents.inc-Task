import { useState } from 'react'
import { formatOklch, formatRgb, parseColor } from '../lib/color'
import type { OklchColor } from '../types/color'

interface ColorInputsProps {
  color: OklchColor
  onColorChange: (color: OklchColor) => void
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function ColorInputs({ color, onColorChange }: ColorInputsProps) {
  const oklchValue = formatOklch(color)
  const rgbValue = formatRgb(color)

  const [oklchDraft, setOklchDraft] = useState<string | null>(null)
  const [rgbDraft, setRgbDraft] = useState<string | null>(null)
  const [oklchError, setOklchError] = useState<string | null>(null)
  const [rgbError, setRgbError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<'oklch' | 'rgb' | null>(null)

  const commitOklch = () => {
    const value = oklchDraft ?? oklchValue
    const parsed = parseColor(value)
    if (!parsed) {
      setOklchError('Invalid OKLCH color string')
      return
    }

    setOklchError(null)
    setOklchDraft(null)
    onColorChange(parsed)
  }

  const commitRgb = () => {
    const value = rgbDraft ?? rgbValue
    const parsed = parseColor(value)
    if (!parsed) {
      setRgbError('Invalid RGB color string')
      return
    }

    setRgbError(null)
    setRgbDraft(null)
    onColorChange(parsed)
  }

  const handleCopy = async (field: 'oklch' | 'rgb', value: string) => {
    const copied = await copyToClipboard(value)
    if (!copied) return

    setCopiedField(field)
    window.setTimeout(() => setCopiedField(null), 1500)
  }

  return (
    <div className="color-inputs">
      <div className="input-group">
        <label htmlFor="oklch-input">OKLCH</label>
        <div className="input-row">
          <input
            id="oklch-input"
            type="text"
            value={oklchDraft ?? oklchValue}
            onChange={(event) => {
              setOklchDraft(event.target.value)
              setOklchError(null)
            }}
            onBlur={commitOklch}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitOklch()
            }}
            spellCheck={false}
            aria-invalid={oklchError ? true : undefined}
          />
          <button type="button" onClick={() => handleCopy('oklch', oklchValue)}>
            {copiedField === 'oklch' ? 'Copied' : 'Copy'}
          </button>
        </div>
        {oklchError && <p className="input-error">{oklchError}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="rgb-input">RGB (sRGB)</label>
        <div className="input-row">
          <input
            id="rgb-input"
            type="text"
            value={rgbDraft ?? rgbValue}
            onChange={(event) => {
              setRgbDraft(event.target.value)
              setRgbError(null)
            }}
            onBlur={commitRgb}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitRgb()
            }}
            spellCheck={false}
            aria-invalid={rgbError ? true : undefined}
          />
          <button type="button" onClick={() => handleCopy('rgb', rgbValue)}>
            {copiedField === 'rgb' ? 'Copied' : 'Copy'}
          </button>
        </div>
        {rgbError && <p className="input-error">{rgbError}</p>}
      </div>
    </div>
  )
}
