import { useCallback, useState } from 'react'
import { clampColor } from '../lib/color'
import { DEFAULT_COLOR, type ColorChannel, type OklchColor } from '../types/color'

export function useColorState(initialColor: OklchColor = DEFAULT_COLOR) {
  const [color, setColorState] = useState<OklchColor>(() => clampColor(initialColor))

  const setColor = useCallback((next: OklchColor) => {
    setColorState(clampColor(next))
  }, [])

  const setChannel = useCallback((channel: ColorChannel, value: number) => {
    setColorState((current) => clampColor({ ...current, [channel]: value }))
  }, [])

  const resetColor = useCallback(() => {
    setColorState(DEFAULT_COLOR)
  }, [])

  return {
    color,
    setColor,
    setChannel,
    resetColor,
  }
}

export type ColorState = ReturnType<typeof useColorState>
