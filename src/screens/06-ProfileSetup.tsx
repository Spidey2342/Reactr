import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BackTitle, Button, HomeBar } from '../components'
import { paths } from '../lib/routes'

const avatars = ['😎', '😊', '🤓', '🧔🏾', '👩🏾', '👨🏿‍🦱', '👩🏿‍🦱', '🥳', '🤠', '👽', '🤩', '🧑🏽‍🦱']

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(0)
  const [name, setName] = useState('Kofi')

  return (
    <div className="screen scroll profile-setup">
      <BackTitle title="" onBack={() => navigate(-1)} />
      <h1>Pick your face</h1>
      <p className="muted">Choose an avatar. You can change this later.</p>
      <div className="big-avatar">
        {avatars[avatar]}
        <i aria-hidden="true">✎</i>
      </div>
      <span className="upload">▣ Upload photo</span>
      <div className="avatar-grid">
        {avatars.map((a, i) => (
          <button
            type="button"
            className={i === avatar ? 'active' : ''}
            aria-label={`Avatar ${i + 1}`}
            aria-pressed={i === avatar}
            onClick={() => setAvatar(i)}
            key={i}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="field">
        <label htmlFor="setup-name">DISPLAY NAME</label>
        <div className="count-input">
          <input
            id="setup-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
          />
          <span>{name.length}/16</span>
        </div>
        <small className="muted">This is how friends will spot you in the room.</small>
      </div>
      <Button onClick={() => navigate(paths.home)}>Start playing　→</Button>
      <HomeBar />
    </div>
  )
}
