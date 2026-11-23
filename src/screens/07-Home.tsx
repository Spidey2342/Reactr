import { useNavigate } from 'react-router'
import { BottomTabs, Button, HomeBar, Icon, IconButton, type TabId } from '../components'
import { paths } from '../lib/routes'
import { prefsApi, useGameState } from '../state/gameStore'

const stats: [string, string][] = [
  ['12', 'GAMES'],
  ['4', 'WINS'],
  ['27', 'ROUNDS'],
]

export default function Home() {
  const navigate = useNavigate()
  const { prefs } = useGameState()
  const goTab = (tab: TabId) => navigate(tab === 'home' ? paths.home : paths[tab])

  return (
    <div className="screen scroll home">
      <div className="home-head">
        <div>
          <h1>Hey, Kofi 👋</h1>
          <p>Ready to get roasted by life?</p>
        </div>
        <IconButton
          label={prefs.sound ? 'Mute sound' : 'Unmute sound'}
          onClick={() => prefsApi.setSound(!prefs.sound)}
        >
          <Icon name="sound" />
        </IconButton>
        <button type="button" className="profile-icon" aria-label="Profile" onClick={() => navigate(paths.profile)}>
          😎<i />
        </button>
      </div>
      <Button onClick={() => navigate(paths.create)}>
        <span className="big-plus">＋</span>
        <b>Create Room</b>
        <small>HOST A ROOM, INVITE YOUR SQUAD</small>
      </Button>
      <Button variant="yellow" onClick={() => navigate(paths.join())}>
        <span className="big-plus">⌨</span>
        <b>Join Room</b>
        <small>GOT A 4-LETTER CODE?</small>
      </Button>
      <div className="stats">
        {stats.map(([value, label]) => (
          <div key={label}>
            <b>{value}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <button type="button" className="how-card" onClick={() => navigate(paths.howTo)}>
        <span>▰</span>
        <div>
          <b>How to play</b>
          <small>Master the roast in 60 seconds</small>
        </div>
        <Icon name="arrow" />
      </button>
      <div className="title-row">
        <h2>Top Packs</h2>
        <button type="button" onClick={() => navigate(paths.packs)}>
          VIEW ALL
        </button>
      </div>
      <div className="pack-row">
        <div style={{ backgroundImage: 'url(/assets/pack-classic.jpg)' }}>
          <small>CLASSIC</small>
          <b>THE OG ROAST</b>
        </div>
        <div style={{ backgroundImage: 'url(/assets/pack-work.jpg)' }}>
          <small>WORK LIFE</small>
          <b>9 TO 5 CHAOS</b>
        </div>
      </div>
      <BottomTabs active="home" onChange={goTab} />
      <HomeBar />
    </div>
  )
}
