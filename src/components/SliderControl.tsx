interface SliderControlProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  displayValue: string
  onChange: (value: number) => void
  gradient?: string
}

export function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  gradient,
}: SliderControlProps) {
  return (
    <div className="slider-control">
      <div className="slider-header">
        <label htmlFor={id}>{label}</label>
        <span className="slider-value">{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        style={gradient ? { background: gradient } : undefined}
        className="slider-input"
      />
    </div>
  )
}
