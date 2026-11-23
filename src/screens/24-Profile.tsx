import { useNavigate } from 'react-router'
import { BackTitle, BottomTabs, Chip, HomeBar, Icon, IconButton, Toggle, type TabId } from '../components'
import { paths } from '../lib/routes'
import { prefsApi, useGameState } from '../state/gameStore'

const stats: [string, string][] = [
  ['12', 'GAMES'],
  ['4', 'WINS'],
  ['27', 'ROUNDS'],
]

export default function Profile() {
  const navigate = useNavigate()
  const { prefs } = useGameState()
  const goTab = (tab: TabId) => navigate(tab === 'home' ? paths.home : paths[tab])

  return (
    <div className="screen scroll profile">
      <BackTitle
        title="Profile"
        onBack={() => navigate(paths.home)}
        action={<IconButton label="Settings">⚙</IconButton>}
      />
      <div className="profile-top">
        <div className="big-avatar">😎</div>
        <h2>Kofi Mensah</h2>
        <small>@kofi_reacts</small>
      </div>
      <div className="stats">
        {stats.map(([value, label]) => (
          <div key={label}>
            <b>{value}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <h3 className="section-title">Badges</h3>
      <div className="badges">
        <Chip color="mint">🏆 FIRST WIN</Chip>
        <Chip color="yellow">♥ CROWD FAVE</Chip>
      </div>
      <h3 className="section-title">Settings</h3>
      <div className="settings-list">
        <label>
          <span>🔊 Sound</span>
          <Toggle label="Sound" on={prefs.sound} onChange={prefsApi.setSound} />
        </label>
        <label>
          <span>📳 Haptics</span>
          <Toggle label="Haptics" on={prefs.haptics} onChange={prefsApi.setHaptics} />
        </label>
        <button type="button">
          ✎ Edit profile <Icon name="arrow" />
        </button>
        <button type="button">
          ↳ Log out <Icon name="arrow" />
        </button>
      </div>
      <BottomTabs active="profile" onChange={goTab} />
      <HomeBar />
    </div>
  )
}
