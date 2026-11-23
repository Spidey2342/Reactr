import { Icon, type IconName } from './Icon'

export type TabId = 'home' | 'packs' | 'profile'

const tabs: [TabId, IconName, string][] = [
  ['home', 'home', 'Home'],
  ['packs', 'layers', 'Packs'],
  ['profile', 'user', 'Profile'],
]

/** Lives outside the scrolling region of a Screen (pass it as `tabs`), so it never scrolls away. */
export function BottomTabs({ active, onChange }: { active: TabId; onChange: (tab: TabId) => void }) {
  return (
    <nav className="tabs" aria-label="Main">
      {tabs.map(([id, icon, label]) => {
        const body = (
          <>
            <Icon name={icon} size={26} />
            <span>{label}</span>
          </>
        )
        // The tab you are on is a label, not a button: tapping it would have nowhere to go.
        return active === id ? (
          <div key={id} className="tab active" aria-current="page">
            {body}
          </div>
        ) : (
          <button type="button" key={id} className="tab" onClick={() => onChange(id)}>
            {body}
          </button>
        )
      })}
    </nav>
  )
}
