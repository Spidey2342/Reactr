export type TabId = 'home' | 'packs' | 'profile'

const tabs: [TabId, string, string][] = [
  ['home', '⌂', 'Home'],
  ['packs', '▱', 'Packs'],
  ['profile', '♟', 'Profile'],
]

export function BottomTabs({ active, onChange }: { active: TabId; onChange: (tab: TabId) => void }) {
  return (
    <nav className="tabs" aria-label="Main">
      {tabs.map(([id, icon, label]) => (
        <button
          type="button"
          key={id}
          className={active === id ? 'active' : ''}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onChange(id)}
        >
          <i aria-hidden="true">{icon}</i>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
