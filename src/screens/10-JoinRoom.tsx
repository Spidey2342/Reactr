import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BackTitle, Button, Icon, Modal, RoomCode, Screen, toast } from '../components'
import { feedback } from '../lib/feedback'
import { useBack } from '../lib/nav'
import { paths } from '../lib/routes'
import { gameApi } from '../state/gameStore'

type Status = 'idle' | 'looking' | 'invalid' | 'full'

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

/** Pulls a 4-letter room code out of pasted text or a scanned link such as https://reactr.app/join/KFZA. */
function parseCode(text: string): string | null {
  const link = text.match(/\/join\/([A-Za-z]{4})\b/)
  if (link) return link[1].toUpperCase()
  const bare = text.trim().match(/^[A-Za-z]{4}$/)
  if (bare) return bare[0].toUpperCase()
  // In a sentence, only an all-caps word counts, so "Join my game: KFZA" gives KFZA and not JOIN.
  const word = text.match(/\b[A-Z]{4}\b/)
  return word ? word[0] : null
}

type BarcodeDetectorLike = new (opts: { formats: string[] }) => {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>
}
const getDetector = () => (window as unknown as { BarcodeDetector?: BarcodeDetectorLike }).BarcodeDetector

function QrScanSheet({ onCode, close }: { onCode: (value: string) => void; close: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [message, setMessage] = useState('Starting the camera...')
  // Keep the latest callback in a ref so a parent re-render does not restart the camera.
  const onCodeRef = useRef(onCode)
  useEffect(() => {
    onCodeRef.current = onCode
  })

  useEffect(() => {
    let stopped = false
    let stream: MediaStream | null = null
    let timer = 0
    const Detector = getDetector()

    const run = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        const video = videoRef.current
        if (stopped || !video || !Detector) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        video.srcObject = stream
        await video.play()
        setMessage('Point the camera at the host’s QR code')
        const detector = new Detector({ formats: ['qr_code'] })
        const scan = async () => {
          if (stopped) return
          try {
            const found = await detector.detect(video)
            if (found[0]) {
              onCodeRef.current(found[0].rawValue)
              return
            }
          } catch {
            /* a frame that fails to decode is fine, try the next one */
          }
          timer = window.setTimeout(scan, 250)
        }
        void scan()
      } catch (err) {
        const denied = err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'SecurityError')
        setMessage(
          denied
            ? 'Camera permission was denied. Allow it in your browser settings, or type the code instead.'
            : 'No camera could be started on this device. Type the code instead.',
        )
      }
    }
    void run()
    return () => {
      stopped = true
      window.clearTimeout(timer)
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <Modal title="Scan QR code" onClose={close} actions={<Button variant="secondary" onClick={close}>Close</Button>}>
      <video ref={videoRef} className="qr-video" muted playsInline />
      <p className="muted" role="status">
        {message}
      </p>
    </Modal>
  )
}

export default function JoinRoom() {
  const navigate = useNavigate()
  const params = useParams()
  const back = useBack()
  // /join/:code deep links prefill the code. 'KFZ' is demo data that Phase 1 removes.
  const [code, setCode] = useState(() => params.code?.toUpperCase().slice(0, 4) ?? 'KFZ')
  const [status, setStatus] = useState<Status>('idle')
  const [scanning, setScanning] = useState(false)
  const busy = status === 'looking'

  const type = (key: string) => {
    if (busy) return
    setStatus('idle')
    setCode((c) => (key === '⌫' ? c.slice(0, -1) : (c + key).slice(0, 4)))
  }

  const submit = async () => {
    if (code.length < 4 || busy) return
    setStatus('looking')
    const result = await gameApi.joinRoom(code)
    if (result.ok) navigate(paths.room(result.code))
    else {
      feedback.error()
      setStatus(result.error === 'full' ? 'full' : 'invalid')
    }
  }

  // Physical keyboard: letters, Backspace, Enter.
  const latest = useRef({ type, submit })
  latest.current = { type, submit }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (/^[a-zA-Z]$/.test(e.key)) latest.current.type(e.key.toUpperCase())
      else if (e.key === 'Backspace') latest.current.type('⌫')
      else if (e.key === 'Enter') void latest.current.submit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const found = parseCode(text)
      if (found) {
        setStatus('idle')
        setCode(found)
        toast(`Pasted ${found}`)
      } else {
        toast('There is no room code on your clipboard.', 'error')
      }
    } catch {
      toast("Couldn't read your clipboard. Allow clipboard access, or type the code.", 'error')
    }
  }

  const scan = () => {
    if (!getDetector() || !navigator.mediaDevices?.getUserMedia) {
      toast("QR scanning isn't supported in this browser. Type the code instead.", 'error')
      return
    }
    setScanning(true)
  }

  const onScanned = (value: string) => {
    setScanning(false)
    const found = parseCode(value)
    if (found) {
      setStatus('idle')
      setCode(found)
      toast(`Scanned ${found}`)
    } else {
      toast("That QR code isn't a Reactr room.", 'error')
    }
  }

  return (
    <Screen
      className="join"
      head={<BackTitle title="Join room" onBack={back} />}
      footClass="join-foot"
      foot={
        <>
          <div className="join-cta">
            <Button cta disabled={code.length < 4} loading={busy} onClick={submit}>
              Join
            </Button>
          </div>
          <div className="keyboard" role="group" aria-label="Room code keyboard">
            {ROWS.map((row, r) => (
              <div className="key-row" key={row}>
                {r === 2 && <span className="key-gap" aria-hidden="true" />}
                {row.split('').map((k) => (
                  <button type="button" key={k} onClick={() => type(k)}>
                    {k}
                  </button>
                ))}
                {r === 2 && (
                  <button type="button" className="key-del" aria-label="Delete" onClick={() => type('⌫')}>
                    <Icon name="backspace" size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      }
    >
      <div className="join-title">
        <h2>Enter the room code</h2>
        <p>Ask the host for the 4-letter code</p>
      </div>
      <RoomCode code={code} typing={!busy && code.length < 4} />
      {status !== 'idle' && (
        <p className={`join-status ${status}`} role="status">
          {busy && <i className="spinner small" aria-hidden="true" />}
          {status === 'looking'
            ? 'Looking for the room...'
            : status === 'invalid'
              ? 'Room not found. Check the code.'
              : 'This room is full.'}
        </p>
      )}
      <button type="button" className="paste" onClick={paste}>
        <Icon name="clipboard" size={16} /> Paste code
      </button>
      <Button variant="secondary" onClick={scan}>
        <Icon name="qr" size={18} />　Scan QR
      </Button>
      {scanning && <QrScanSheet onCode={onScanned} close={() => setScanning(false)} />}
    </Screen>
  )
}
