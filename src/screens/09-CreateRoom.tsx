import { useNavigate } from 'react-router'
import { BackTitle, Button, Chip, HomeBar, IconButton, Stepper, Toggle } from '../components'
import { packs } from '../data/dev-fixtures/packs' // DEV FIXTURE
import { paths } from '../lib/routes'
import { gameApi, useGameState } from '../state/gameStore'
import type { RoomSettings } from '../types'

export default function CreateRoom() {
  const navigate = useNavigate()
  const { draftSettings: settings } = useGameState()
  const patch = (p: Partial<RoomSettings>) => gameApi.setDraftSettings({ ...settings, ...p })

  const create = () => {
    const room = gameApi.createRoom()
    navigate(paths.room(room.code))
  }

  return (
    <div className="screen scroll create">
      <BackTitle
        title="Create room"
        onBack={() => navigate(paths.home)}
        action={<IconButton label="Settings">⚙</IconButton>}
      />
      <h3 className="setting-title">
        <i />
        Points to win
      </h3>
      <div className="choice-grid">
        {[3, 5, 7, 10].map((n) => (
          <button
            type="button"
            key={n}
            className={settings.pointsToWin === n ? 'active yellow' : ''}
            onClick={() => patch({ pointsToWin: n })}
          >
            {n}
          </button>
        ))}
      </div>
      <h3 className="setting-title pink-dot">
        <i />
        Pick timer
      </h3>
      <div className="choice-grid two">
        {[20, 30, 45, 0].map((n) => (
          <button
            type="button"
            key={n}
            className={settings.pickTimer === n ? 'active pink-bg' : ''}
            onClick={() => patch({ pickTimer: n })}
          >
            {n ? `${n} sec` : 'No timer'}
          </button>
        ))}
      </div>
      <div className="card max-players">
        <div>
          <b>Max players</b>
          <small>3 TO 8 PLAYERS</small>
        </div>
        <Stepper value={settings.maxPlayers} setValue={(n) => patch({ maxPlayers: n })} />
      </div>
      <h3 className="section-title">Packs included</h3>
      <div className="chips">
        {packs.map((p) => (
          <Chip
            key={p.name}
            color={p.color}
            active={settings.packs.includes(p.name)}
            onClick={() =>
              patch({
                packs: settings.packs.includes(p.name)
                  ? settings.packs.filter((x) => x !== p.name)
                  : [...settings.packs, p.name],
              })
            }
          >
            {p.name}
          </Chip>
        ))}
      </div>
      <h3 className="section-title">Judge mode</h3>
      <div className="judge-choices">
        <button
          type="button"
          className={settings.judgeMode === 'rotating' ? 'active' : ''}
          onClick={() => patch({ judgeMode: 'rotating' })}
        >
          <b>⟳　Rotating</b>
          <small>Everyone takes turns</small>
        </button>
        <button
          type="button"
          className={settings.judgeMode === 'random' ? 'active' : ''}
          onClick={() => patch({ judgeMode: 'random' })}
        >
          <b>🎲　Random</b>
          <small>Surprise pick each round</small>
        </button>
      </div>
      <div className="card toggle-row">
        <div>
          <b>Allow mid-game join</b>
          <small>Players can join anytime</small>
        </div>
        <Toggle label="Allow mid-game join" on={settings.midGameJoin} onChange={(v) => patch({ midGameJoin: v })} />
      </div>
      <Button onClick={create}>🪄　Create room</Button>
      <HomeBar />
    </div>
  )
}
