import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router'

// import.meta.env.DEV is statically false in production builds, so this chunk is dropped entirely.
const DebugMenu = import.meta.env.DEV ? lazy(() => import('../components/DebugMenu')) : null

export default function AppLayout() {
  return (
    <main className="app">
      <Outlet />
      {DebugMenu && (
        <Suspense fallback={null}>
          <DebugMenu />
        </Suspense>
      )}
    </main>
  )
}
