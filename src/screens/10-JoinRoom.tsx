import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BackTitle, Button, HomeBar, RoomCode } from '../components'
import { paths } from '../lib/routes'
import { gameApi } from '../state/gameStore'

type Status = 'idle' | 'looking' | 'invalid' | 'full'

const KEYS = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('')

export default function JoinRoom() {
  const navigate = useNavigate()
  const params = useParams()
  // /join/:code deep links prefill the code. 'KFZ' is demo data that Phase 1 removes.
  const [code, setCode] = useState(() => params.code?.toUpperCase().slice(0, 4) ?? 'KFZ')
  const [status, setStatus] = useState<Status>('idle')

  const type = (key: string) => setCode((c) => (key === '⌫' ? c.slice(0, -1) : (c + key).slice(0, 4)))

  const submit = async () => {
    setStatus('looking')
    const result = await gameApi.joinRoom(code)
    if (result.ok) navigate(paths.room(result.code))
    else setStatus(result.error === 'full' ? 'full' : 'invalid')
  }

  return (
    <div className="screen join">
      <BackTitle title="Join room" onBack={() => navigate(paths.home)} />
      <div className="join-title">
        <h2>Enter the room code</h2>
        <p>Ask the host for the 4-letter code</p>
      </div>
      <RoomCode code={code} />
      {status !== 'idle' && (
        <p className="join-status" role="status">
          {status === 'looking'
            ? 'Looking for the room...'
            : status === 'invalid'
              ? 'Room not found. Check the code.'
              : 'This room is full.'}
        </p>
      )}
      <button type="button" className="paste">
        📋　Paste code
      </button>
      <Button variant="secondary">▣　Scan QR</Button>
      <div className="keyboard">
        {KEYS.map((k) => (
          <button type="button" key={k} onClick={() => type(k)}>
            {k}
          </button>
        ))}
        <button type="button" aria-label="Delete" onClick={() => type('⌫')}>
          ⌫
        </button>
      </div>
      <Button disabled={code.length < 4 || status === 'looking'} onClick={submit}>
        Join
      </Button>
      <HomeBar />
    </div>
  )
}
