import { useNavigate } from 'react-router'
import { BackTitle, Button, HomeBar } from '../components'
import { paths } from '../lib/routes'

const steps: [string, string, string][] = [
  ['1', 'A situation drops', 'The host reveals a prompt everyone can relate to.'],
  ['2', 'Everyone secretly picks', 'Choose one reaction card from your hand.'],
  ['3', 'Reveal and react', 'Cards flip one by one. React with emojis.'],
  ['4', 'First to 5 wins', 'The judge crowns the funniest card.'],
]
const visuals = ['▱', '▰▰', '♠', '🏆']

export default function HowToPlay() {
  const navigate = useNavigate()
  const back = () => navigate(paths.home)

  return (
    <div className="screen scroll how">
      <BackTitle title="How to play" onBack={back} />
      {steps.map(([n, title, text], i) => (
        <div className="how-step" key={n}>
          <b>{n}</b>
          <div className={`how-visual v${i}`} aria-hidden="true">
            {visuals[i]}
          </div>
          <section>
            <h3>{title}</h3>
            <p>{text}</p>
          </section>
        </div>
      ))}
      <Button onClick={back}>Got it!</Button>
      <HomeBar />
    </div>
  )
}
