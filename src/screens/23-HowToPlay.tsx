import { BackTitle, Button, Screen } from '../components'
import { useBack } from '../lib/nav'

const steps: [string, string, string][] = [
  ['1', 'A situation drops', 'The host reveals a prompt everyone can relate to.'],
  ['2', 'Everyone secretly picks', 'Choose one reaction card from your hand.'],
  ['3', 'Reveal and react', 'Cards flip one by one. React with emojis.'],
  ['4', 'First to 5 wins', 'The judge crowns the funniest card.'],
]
const visuals = ['▱', '▰▰', '♠', '🏆']

/** The four steps. Used by the How to play screen and by the sheet in the pause menu. */
export function HowSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'how-steps compact' : 'how-steps'}>
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
    </div>
  )
}

export default function HowToPlay() {
  const back = useBack()

  return (
    <Screen
      className="how"
      head={<BackTitle title="How to play" onBack={back} />}
      foot={
        <Button cta onClick={back}>
          Got it!
        </Button>
      }
    >
      <HowSteps />
    </Screen>
  )
}
