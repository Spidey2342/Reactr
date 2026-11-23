import { useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Button, ProgressDots, Reaction, Screen } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
import { feedback } from '../lib/feedback'
import { paths } from '../lib/routes'

const slides: { title: string; text: string; art: ReactNode }[] = [
  {
    title: 'A situation drops',
    text: 'Every round starts with a wild everyday scenario. React. Laugh. Repeat.',
    art: (
      <>
        <div className="ob-scenario">“When the waiter says ‘it’s coming’ after 40 minutes”</div>
        <b className="sticker">SCENARIO 1</b>
      </>
    ),
  },
  {
    title: 'Everyone reacts',
    text: 'Everyone secretly plays a reaction card. Pick the one that hits hardest.',
    art: (
      <div className="ob-cards">
        <Reaction mini card={reactionCards[1]} />
        <Reaction mini card={reactionCards[0]} />
        <Reaction mini card={reactionCards[2]} />
      </div>
    ),
  },
  {
    title: 'The judge decides',
    text: 'A rotating judge reads the room and crowns the funniest card. First to the target score wins.',
    art: (
      <div className="trophy">
        <span role="img" aria-label="Trophy">
          🏆
        </span>
        <i>♛ JUDGE</i>
      </div>
    ),
  },
]

const SWIPE_PX = 48

export default function Onboarding() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<'next' | 'prev'>('next')
  const start = useRef<{ x: number; y: number } | null>(null)
  const slide = slides[index]
  const last = index === slides.length - 1
  const toSignUp = () => navigate(paths.signup)

  const go = (to: number) => {
    if (to < 0 || to > slides.length - 1 || to === index) return
    setDir(to > index ? 'next' : 'prev')
    setIndex(to)
    feedback.select()
  }

  return (
    <Screen
      className="onboarding"
      head={
        <div className="ob-head">
          <button type="button" className="skip" onClick={toSignUp}>
            Skip
          </button>
        </div>
      }
      foot={
        <Button cta onClick={() => (last ? toSignUp() : go(index + 1))}>
          {last ? "Let's go" : 'Next'}　→
        </Button>
      }
    >
      <div
        className="ob-swipe"
        onPointerDown={(e) => {
          start.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={(e) => {
          const s = start.current
          start.current = null
          if (!s) return
          const dx = e.clientX - s.x
          if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(index + (dx < 0 ? 1 : -1))
        }}
        onPointerCancel={() => {
          start.current = null
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(index + 1)
          if (e.key === 'ArrowLeft') go(index - 1)
        }}
      >
        <div key={index} className={`ob-slide ${dir}`} data-testid="ob-slide">
          <div className="ob-art">{slide.art}</div>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
        </div>
        <ProgressDots index={index} />
      </div>
    </Screen>
  )
}
