import type { ReactNode } from 'react'
import { HomeBar } from './HomeBar'

export function StateShell({
  accent = 'pink',
  icon,
  title,
  text,
  children,
}: {
  accent?: string
  icon: string
  title: string
  text: string
  children: ReactNode
}) {
  return (
    <div className={`screen system-state ${accent}`}>
      <div className="state-icon" aria-hidden="true">
        {icon}
      </div>
      <h1>{title}</h1>
      <p>{text}</p>
      {children}
      <HomeBar />
    </div>
  )
}
