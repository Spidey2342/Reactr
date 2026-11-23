/** Minimal external store, consumed with React's useSyncExternalStore. No dependencies. */
export interface Store<S> {
  getState: () => S
  setState: (update: S | ((prev: S) => S)) => void
  subscribe: (listener: () => void) => () => void
}

export function createStore<S>(initial: S): Store<S> {
  let state = initial
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState: (update) => {
      const next = typeof update === 'function' ? (update as (prev: S) => S)(state) : update
      if (next === state) return
      state = next
      listeners.forEach((l) => l())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
