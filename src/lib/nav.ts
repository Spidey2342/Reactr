import { useNavigate } from 'react-router'
import { paths } from './routes'

/** Go back one entry, or to Home when this screen was opened directly (no history to go back to). */
export function useBack(fallback: string = paths.home) {
  const navigate = useNavigate()
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate(fallback, { replace: true })
  }
}
