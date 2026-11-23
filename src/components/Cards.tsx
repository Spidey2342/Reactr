import type { ReactionCard, ScenarioCard } from '../types'

export function Scenario({ scenario, compact = false }: { scenario: ScenarioCard; compact?: boolean }) {
  return (
    <div className={`scenario ${compact ? 'compact' : ''}`}>
      <span aria-hidden="true">{scenario.emoji}</span>
      <strong>{scenario.text}</strong>
    </div>
  )
}

/** A reaction card. With `onClick` it is a button; without, it is plain content (not in the tab order). */
export function Reaction({
  card,
  selected = false,
  onClick,
  mini = false,
}: {
  card: ReactionCard
  selected?: boolean
  onClick?: () => void
  mini?: boolean
}) {
  const className = `reaction ${card.color} ${selected ? 'selected' : ''} ${mini ? 'mini' : ''} ${onClick ? 'tappable' : ''}`
  const inner = (
    <>
      <img src={card.imageUrl} alt="" draggable={false} />
      <strong>{card.caption}</strong>
    </>
  )
  if (!onClick) {
    return (
      <div className={className} role="img" aria-label={card.caption}>
        {inner}
      </div>
    )
  }
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} aria-label={card.caption} className={className}>
      {inner}
    </button>
  )
}
