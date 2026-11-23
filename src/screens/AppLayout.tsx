import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { HomeBar, ToastHost, toast } from '../components'
import { installDevHooks } from '../lib/devHooks'
import { feedback } from '../lib/feedback'
import { returnedFromOAuth } from '../lib/supabase'
import { sessionApi } from '../state/gameStore'

// import.meta.env.DEV is statically false in production builds, so this chunk is dropped entirely.
const DebugMenu = import.meta.env.DEV ? lazy(() => import('../components/DebugMenu')) : null

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    installDevHooks((path) => navigate(path))
  }, [navigate])

  // Back from Google via Supabase: the access token is in the hash. Real session handling is Phase 3.
  useEffect(() => {
    if (!returnedFromOAuth()) return
    sessionApi.logIn({ contact: 'google' })
    window.history.replaceState(null, '', window.location.pathname)
    toast('Signed in with Google')
  }, [])

  return (
    <main
      className="app"
      onPointerDown={(e) => {
        const button = (e.target as Element).closest('button')
        if (button && !button.disabled) feedback.tap()
      }}
    >
      {/* Keyed by path so every route change plays the same short slide-in. */}
      <div key={location.pathname} className="screen-transition">
        <Outlet />
      </div>
      {DebugMenu && (
        <Suspense fallback={null}>
          <DebugMenu />
        </Suspense>
      )}
      <ToastHost />
      <HomeBar />
    </main>
  )
}
