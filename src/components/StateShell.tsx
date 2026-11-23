import type { ReactNode } from 'react'
import { Screen } from './Screen'

export function StateShell({
  accent = 'pink',
  icon,
  title,
  text,
  foot,
  children,
}: {
  accent?: string
  icon: string
  title: string
  text: string
  foot?: ReactNode
  children?: ReactNode
}) {
  return (
    <Screen className={`system-state ${accent}`} foot={foot}>
      <div className="state-icon" aria-hidden="true">
        {icon}
      </div>
      <h1>{title}</h1>
      <p>{text}</p>
      {children}
    </Screen>
  )
}
