import type { ReactionCard, ScenarioCard } from '../types'

export function Scenario({ scenario, compact = false }: { scenario: ScenarioCard; compact?: boolean }) {
  return (
    <div className={`scenario ${compact ? 'compact' : ''}`}>
      <span aria-hidden="true">{scenario.emoji}</span>
      <strong>{scenario.text}</strong>
    </div>
  )
}

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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={`reaction ${card.color} ${selected ? 'selected' : ''} ${mini ? 'mini' : ''}`}
    >
      <img src={card.imageUrl} alt={card.caption} />
      <strong>{card.caption}</strong>
    </button>
  )
}
