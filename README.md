# Reactr

Real-time party card game (React 19 + Vite + TypeScript + Tailwind v4). Game logic is currently a
client-side mock (`src/state/mockEngine.ts`); Phase 2 replaces it with Supabase.

## Commands

```bash
pnpm install        # first run updates pnpm-lock.yaml (new deps: react-router, @fontsource/*)
pnpm typecheck      # tsc --noEmit  -> passes with no output
pnpm build          # vite build    -> "built in ..." with no errors
pnpm dev            # http://localhost:8443 (or the port Vite prints)
```

Routes: `/`, `/onboarding`, `/signup`, `/profile-setup`, `/home`, `/packs`, `/profile`, `/create`,
`/join`, `/join/:code`, `/room/:code`, `/how-to-play`. Dev builds also have `/dev/no-internet`,
`/dev/disconnected`, `/dev/host-transfer`.

Copy `.env.example` to `.env.local` once Supabase is wired (Phase 2).
