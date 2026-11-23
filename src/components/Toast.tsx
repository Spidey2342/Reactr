import { useSyncExternalStore } from 'react'
import { createStore } from '../state/createStore'

interface ToastItem {
  id: number
  text: string
  tone: 'info' | 'error'
}

const store = createStore<ToastItem[]>([])
let nextId = 1

/** Show a short message at the top of the screen. */
export function toast(text: string, tone: ToastItem['tone'] = 'info') {
  const id = nextId++
  store.setState((list) => [...list.slice(-2), { id, text, tone }])
  setTimeout(() => store.setState((list) => list.filter((t) => t.id !== id)), 2600)
}

export function ToastHost() {
  const list = useSyncExternalStore(store.subscribe, store.getState, store.getState)
  return (
    <div className="toasts" role="status" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={`toast ${t.tone}`}>
          {t.text}
        </div>
      ))}
    </div>
  )
}
