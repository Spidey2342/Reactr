import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BackTitle, BottomTabs, Screen, Toggle, type TabId } from '../components'
import { packs } from '../data/dev-fixtures/packs' // DEV FIXTURE: counts come from the DB later
import { paths } from '../lib/routes'

export default function Packs() {
  const navigate = useNavigate()
  const [active, setActive] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(packs.map((p, i) => [p.name, i < 3 || i === 4])),
  )
  const activeCount = Object.values(active).filter(Boolean).length
  const cardCount = packs.filter((p) => active[p.name]).reduce((n, p) => n + p.count, 0)
  const goTab = (tab: TabId) => navigate(tab === 'home' ? paths.home : paths[tab])

  return (
    <Screen
      className="packs"
      head={<BackTitle title="Packs" onBack={() => navigate(paths.home)} />}
      tabs={<BottomTabs active="packs" onChange={goTab} />}
    >
      <p className="muted">Pick the chaos you want in your game.</p>
      <div className="active-counter">
        <b>{activeCount} packs active</b>
        <span>{cardCount} cards in play</span>
      </div>
      {packs.map((p) => (
        <div className="pack-item" key={p.name}>
          <span aria-hidden="true">{p.emoji}</span>
          <div>
            <b>{p.name}</b>
            <small>{p.count} cards</small>
          </div>
          <Toggle label={p.name} on={active[p.name]} onChange={(v) => setActive({ ...active, [p.name]: v })} />
        </div>
      ))}
      <h3 className="section-title">Coming Soon</h3>
      {['Church Gist', 'Campus Crush'].map((name) => (
        <div className="pack-item locked" key={name}>
          <span aria-hidden="true">🔒</span>
          <div>
            <b>{name}</b>
            <small>COMING SOON</small>
          </div>
        </div>
      ))}
    </Screen>
  )
}
