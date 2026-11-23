import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { BackTitle, Button, FaceAvatar, Screen, toast } from '../components'
import { AVATARS, fileToAvatar } from '../lib/avatar'
import { useBack } from '../lib/nav'
import { paths } from '../lib/routes'
import { sessionApi, useSession } from '../state/gameStore'

export default function ProfileSetup() {
  const navigate = useNavigate()
  const back = useBack(paths.signup)
  const session = useSession()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatar, setAvatar] = useState(Math.max(0, AVATARS.indexOf(session.avatar)))
  const [photo, setPhoto] = useState<string | undefined>(session.photo)
  const [name, setName] = useState(session.name)

  const onFile = async (file?: File) => {
    if (!file) return
    try {
      setPhoto(await fileToAvatar(file))
    } catch {
      toast("That file couldn't be used as a photo. Try a JPG or PNG.", 'error')
    }
  }

  const finish = () => {
    sessionApi.updateProfile({ name: name.trim() || session.name, avatar: AVATARS[avatar], photo })
    navigate(paths.home)
  }

  return (
    <Screen
      className="profile-setup"
      head={<BackTitle title="" onBack={back} />}
      foot={
        <Button cta onClick={finish}>
          Start playing　→
        </Button>
      }
    >
      <h1>Pick your face</h1>
      <p className="muted">Choose an avatar. You can change this later.</p>
      <div className="big-avatar">
        <FaceAvatar session={{ avatar: AVATARS[avatar], photo }} />
        <button type="button" className="edit-badge" aria-label="Upload photo" onClick={() => fileRef.current?.click()}>
          ✎
        </button>
      </div>
      <button type="button" className="upload" onClick={() => fileRef.current?.click()}>
        ▣ Upload photo
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          void onFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <div className="avatar-grid" role="radiogroup" aria-label="Avatar">
        {AVATARS.map((a, i) => (
          <button
            type="button"
            role="radio"
            className={i === avatar && !photo ? 'active' : ''}
            aria-label={`Avatar ${i + 1}`}
            aria-checked={i === avatar && !photo}
            onClick={() => {
              setAvatar(i)
              setPhoto(undefined)
            }}
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
    </Screen>
  )
}
