import { useEffect, useRef } from 'react'
import { getColorFromUrl, serializeHash, writeHashToUrl } from '../lib/urlHash'
import type { OklchColor } from '../types/color'

const DEBOUNCE_MS = 100

export function useUrlHashSync(
  color: OklchColor,
  setColor: (color: OklchColor) => void,
) {
  const isApplyingHash = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const initial = getColorFromUrl()
    isApplyingHash.current = true
    setColor(initial)
    requestAnimationFrame(() => {
      isApplyingHash.current = false
    })
  }, [setColor])

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = getColorFromUrl()
      isApplyingHash.current = true
      setColor(parsed)
      requestAnimationFrame(() => {
        isApplyingHash.current = false
      })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [setColor])

  useEffect(() => {
    if (isApplyingHash.current) return

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      writeHashToUrl(serializeHash(color))
    }, DEBOUNCE_MS)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [color])
}
