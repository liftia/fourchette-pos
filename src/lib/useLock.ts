import { useCallback, useRef, useState } from 'react'

export function useLock(): { busy: boolean; guard: (action: () => Promise<void>) => Promise<void> } {
  // La référence bloque un second clic avant même le rendu qui désactive le bouton.
  const lock = useRef(false)
  const [busy, setBusy] = useState(false)

  const guard = useCallback(async (action: () => Promise<void>) => {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    try {
      await action()
    } finally {
      lock.current = false
      setBusy(false)
    }
  }, [])

  return { busy, guard }
}
