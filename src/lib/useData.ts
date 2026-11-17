import { useCallback, useEffect, useRef, useState } from 'react'
import { call, sentence } from './api.ts'

export function useData<T>(url: string | null): {
  data: T | null
  error: string | null
  reload: () => Promise<void>
} {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Deux rechargements peuvent se chevaucher (focus, clic) : seule la réponse du plus récent est gardée.
  const latest = useRef(0)

  const reload = useCallback(async () => {
    const round = ++latest.current
    if (url === null) {
      setData(null)
      setError(null)
      return
    }
    try {
      const received = await call<T>('GET', url)
      if (round !== latest.current) return
      setData(received)
      setError(null)
    } catch (e) {
      if (round !== latest.current) return
      setError(sentence(e))
    }
  }, [url])

  useEffect(() => {
    const onFocus = () => void reload()
    onFocus()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reload])

  return { data, error, reload }
}
