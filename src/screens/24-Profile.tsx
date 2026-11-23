import { useState } from 'react'
import { useNavigate } from 'react-router'
import pkg from '../../package.json'
import {
  BackTitle,
  BottomTabs,
  Button,
  FaceAvatar,
  Icon,
  IconButton,
  Modal,
  Screen,
  SettingsSheet,
  Toggle,
  toast,
  type IconName,
  type TabId,
} from '../components'
import { AVATARS } from '../lib/avatar'
import { paths } from '../lib/routes'
import { prefsApi, sessionApi, useGameState } from '../state/gameStore'

const stats: [string, string, string][] = [
  ['12', 'GAMES PLAYED', 'mint'],
  ['4', 'WINS', 'yellow'],
  ['27', 'ROUNDS WON', 'pink'],
  ['3', 'FUNNIEST STREAK', 'mint'],
]

interface Badge {
  id: string
  icon: IconName
  name: string
  tag?: string
  locked?: boolean
  text: string
}

const badges: Badge[] = [
  { id: 'first', icon: 'trophy', name: 'First Win', tag: 'FIRST', text: 'Awarded for winning your first game.' },
  {
    id: 'crowd',
    icon: 'heart',
    name: 'Crowd Favourite',
    text: 'Awarded when your card gets more reactions than any other card in a round.',
  },
  {
    id: 'streak',
    icon: 'bone',
    name: 'Funniest Streak',
    text: 'Awarded for having your card crowned in three rounds in a row.',
  },
  {
    id: 'locked',
    icon: 'lock',
    name: 'Locked badge',
    locked: true,
    text: 'Keep playing to unlock this one. Its name stays secret until you earn it.',
  },
]

function EditProfileSheet({ close }: { close: () => void }) {
  const { session } = useGameState()
  const [name, setName] = useState(session.name)
  const [avatar, setAvatar] = useState(session.photo ? -1 : Math.max(0, AVATARS.indexOf(session.avatar)))
  const clean = name.trim()

  const save = () => {
    if (!clean) return
    sessionApi.updateProfile({
      name: clean,
      ...(avatar >= 0 ? { avatar: AVATARS[avatar], photo: undefined } : {}),
    })
    toast('Profile updated')
    close()
  }

  return (
    <Modal title="Edit profile" onClose={close} actions={<Button disabled={!clean} onClick={save}>Save</Button>}>
      <div className="avatar-grid" role="radiogroup" aria-label="Avatar">
        {AVATARS.map((a, i) => (
          <button
            type="button"
            role="radio"
            key={a}
            className={i === avatar ? 'active' : ''}
            aria-label={`Avatar ${i + 1}`}
            aria-checked={i === avatar}
            onClick={() => setAvatar(i)}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="field left">
        <label htmlFor="edit-name">DISPLAY NAME</label>
        <div className="count-input">
          <input
            id="edit-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
          />
          <span>{name.length}/16</span>
        </div>
      </div>
    </Modal>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { prefs, session } = useGameState()
  const [sheet, setSheet] = useState<'settings' | 'edit' | 'privacy' | 'delete' | null>(null)
  const [badge, setBadge] = useState<Badge | null>(null)
  const goTab = (tab: TabId) => navigate(tab === 'home' ? paths.home : paths[tab])

  const logOut = () => {
    sessionApi.logOut()
    toast('You are logged out')
    navigate(paths.signup, { state: { mode: 'login' }, replace: true })
  }
  const rate = () => toast('Thanks! Rating opens once Reactr is in the app stores.')
  const deleteAccount = () => {
    sessionApi.deleteAccount()
    setSheet(null)
    toast('Your account was deleted')
    navigate(paths.signup, { replace: true })
  }

  return (
    <Screen
      className="profile"
      head={
        <BackTitle
          title="Profile"
          onBack={() => navigate(paths.home)}
          action={
            <IconButton label="Settings" onClick={() => setSheet('settings')}>
              <Icon name="settings" />
            </IconButton>
          }
        />
      }
      tabs={<BottomTabs active="profile" onChange={goTab} />}
    >
      <div className="profile-top">
        <div className="big-avatar">
          <FaceAvatar session={session} />
          <button type="button" className="edit-badge" aria-label="Change avatar" onClick={() => setSheet('edit')}>
            <Icon name="pencil" size={13} />
          </button>
        </div>
        <h2>{session.name}</h2>
        <small>@{session.handle}</small>
        <button type="button" className="pill-btn" onClick={() => setSheet('edit')}>
          EDIT PROFILE
        </button>
      </div>
      <div className="stats four">
        {stats.map(([value, label, color]) => (
          <div key={label} className={color}>
            <small>{label}</small>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <h3 className="section-title">Badges</h3>
      <div className="badge-row">
        {badges.map((b) => (
          <button
            type="button"
            key={b.id}
            className={`badge-tile ${b.id} ${b.locked ? 'locked' : ''}`}
            aria-label={b.locked ? 'Locked badge' : b.name}
            onClick={() => setBadge(b)}
          >
            <Icon name={b.icon} size={26} />
            {b.tag && <em>{b.tag}</em>}
          </button>
        ))}
      </div>
      <div className="settings-list">
        <button type="button" onClick={() => setSheet('edit')}>
          <i className="row-icon pink">
            <Icon name="user" size={18} />
          </i>
          <span>Edit profile</span>
          <Icon name="arrow" size={16} />
        </button>
        <label>
          <i className="row-icon yellow">
            <Icon name="sound" size={18} />
          </i>
          <span>Sound</span>
          <Toggle label="Sound" on={prefs.sound} onChange={prefsApi.setSound} />
        </label>
        <label>
          <i className="row-icon mint">
            <Icon name="bell" size={18} />
          </i>
          <span>Notifications</span>
          <Toggle label="Notifications" on={prefs.notifications} onChange={prefsApi.setNotifications} />
        </label>
        <label>
          <i className="row-icon pink">
            <Icon name="bolt" size={18} />
          </i>
          <span>Haptics</span>
          <Toggle label="Haptics" on={prefs.haptics} onChange={prefsApi.setHaptics} />
        </label>
        <button type="button" onClick={() => setSheet('privacy')}>
          <i className="row-icon">
            <Icon name="shield" size={18} />
          </i>
          <span>Privacy</span>
          <Icon name="arrow" size={16} />
        </button>
        <button type="button" onClick={rate}>
          <i className="row-icon yellow">
            <Icon name="star" size={18} />
          </i>
          <span>Rate the app</span>
          <Icon name="arrow" size={16} />
        </button>
        <button type="button" onClick={logOut}>
          <i className="row-icon">
            <Icon name="logout" size={18} />
          </i>
          <span>Log out</span>
        </button>
        <button type="button" className="danger" onClick={() => setSheet('delete')}>
          <i className="row-icon red">
            <Icon name="trash" size={18} />
          </i>
          <span>Delete account</span>
        </button>
      </div>
      <p className="version">REACTR V{pkg.version}</p>

      {sheet === 'settings' && <SettingsSheet close={() => setSheet(null)} />}
      {sheet === 'edit' && <EditProfileSheet close={() => setSheet(null)} />}
      {sheet === 'privacy' && (
        <Modal
          title="Privacy"
          onClose={() => setSheet(null)}
          actions={
            <Button variant="secondary" onClick={() => setSheet(null)}>
              Close
            </Button>
          }
        >
          <p className="muted left">
            Other players in a room see your display name and avatar. Your email or phone number is never shown to
            them. Game stats stay on your profile.
          </p>
        </Modal>
      )}
      {sheet === 'delete' && (
        <Modal
          title="Delete your account?"
          onClose={() => setSheet(null)}
          actions={
            <div className="dialog-actions">
              <Button variant="secondary" onClick={() => setSheet(null)}>
                Cancel
              </Button>
              <Button onClick={deleteAccount}>Delete</Button>
            </div>
          }
        >
          <p className="muted">This removes your profile and stats. It cannot be undone.</p>
        </Modal>
      )}
      {badge && (
        <Modal
          title={badge.name}
          onClose={() => setBadge(null)}
          actions={<Button onClick={() => setBadge(null)}>Got it</Button>}
        >
          <div className={`badge-big ${badge.locked ? 'locked' : ''}`}>
            <Icon name={badge.icon} size={44} />
          </div>
          <p className="muted">{badge.text}</p>
        </Modal>
      )}
    </Screen>
  )
}
