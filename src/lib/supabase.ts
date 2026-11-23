/**
 * Google sign-in through Supabase OAuth. Only the redirect is wired here: when the env vars are set the
 * button sends the browser to Supabase's authorize endpoint. Reading the session on return is Phase 3.
 */
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '')
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

export function googleSignInUrl(): string {
  const redirect = encodeURIComponent(`${window.location.origin}/home`)
  return `${url}/auth/v1/authorize?provider=google&redirect_to=${redirect}`
}

/** True when the URL hash carries an OAuth access token (we just came back from Google via Supabase). */
export function returnedFromOAuth(): boolean {
  return /[#&]access_token=/.test(window.location.hash)
}
