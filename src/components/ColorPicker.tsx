import { getMaxChroma } from '../lib/color'
import { CHANNEL_RANGES, type ColorChannel, type OklchColor } from '../types/color'
import { ColorInputs } from './ColorInputs'
import { ColorPreview } from './ColorPreview'
import { GamutIndicator } from './GamutIndicator'
import { SliderControl } from './SliderControl'

interface ColorPickerProps {
  color: OklchColor
  onColorChange: (color: OklchColor) => void
  onChannelChange: (channel: ColorChannel, value: number) => void
}

function formatChannelValue(channel: ColorChannel, value: number): string {
  switch (channel) {
    case 'l':
      return `${(value * 100).toFixed(1)}%`
    case 'c':
      return value.toFixed(3)
    case 'h':
      return `${value.toFixed(1)}°`
    case 'alpha':
      return `${(value * 100).toFixed(0)}%`
  }
}

function getSliderGradient(channel: ColorChannel, color: OklchColor): string | undefined {
  if (channel === 'h') {
    return 'linear-gradient(to right, oklch(70% 0.15 0), oklch(70% 0.15 60), oklch(70% 0.15 120), oklch(70% 0.15 180), oklch(70% 0.15 240), oklch(70% 0.15 300), oklch(70% 0.15 360))'
  }

  if (channel === 'alpha') {
    const base = `oklch(${(color.l * 100).toFixed(1)}% ${color.c.toFixed(3)} ${color.h.toFixed(1)})`
    return `linear-gradient(to right, color-mix(in oklch, ${base} 0%, transparent), ${base})`
  }

  return undefined
}

export function ColorPicker({ color, onColorChange, onChannelChange }: ColorPickerProps) {
  const maxChroma = getMaxChroma(color.l, color.h, CHANNEL_RANGES.c.max)

  const channels: ColorChannel[] = ['l', 'c', 'h', 'alpha']

  return (
    <div className="color-picker">
      <section className="picker-panel controls">
        <header className="panel-header">
          <h1>OKLCH Color Picker</h1>
          <p>Explore perceptually uniform colors with live sRGB conversion.</p>
        </header>

        <div className="sliders">
          {channels.map((channel) => {
            const range = CHANNEL_RANGES[channel]
            const max = channel === 'c' ? maxChroma : range.max

            return (
              <SliderControl
                key={channel}
                id={`slider-${channel}`}
                label={range.label}
                value={Math.min(color[channel], max)}
                min={range.min}
                max={max}
                step={range.step}
                displayValue={formatChannelValue(channel, color[channel])}
                onChange={(value) => onChannelChange(channel, value)}
                gradient={getSliderGradient(channel, color)}
              />
            )
          })}
        </div>
      </section>

      <section className="picker-panel preview-panel">
        <ColorPreview color={color} />
        <GamutIndicator color={color} />
        <ColorInputs color={color} onColorChange={onColorChange} />
      </section>
    </div>
  )
}
