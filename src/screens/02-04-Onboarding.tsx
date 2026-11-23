import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Button, HomeBar, ProgressDots, Reaction } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
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

export default function Onboarding() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const toSignUp = () => navigate(paths.signup)

  return (
    <div className="screen onboarding">
      <button type="button" className="skip" onClick={toSignUp}>
        Skip
      </button>
      <div className="ob-art">{slide.art}</div>
      <h1>{slide.title}</h1>
      <p>{slide.text}</p>
      <ProgressDots index={index} />
      <Button onClick={() => (index < 2 ? setIndex(index + 1) : toSignUp())}>
        {index === 2 ? "Let's go" : 'Next'}　→
      </Button>
      <HomeBar />
    </div>
  )
}
