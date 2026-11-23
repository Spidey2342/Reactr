import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Logo, Screen } from '../components'
import { paths } from '../lib/routes'
import { frozen } from '../lib/timing'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    if (frozen()) return
    const t = setTimeout(() => navigate(paths.onboarding), 1900)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <Screen className="splash">
      <div className="stars" aria-hidden="true">
        ·　　✦　　　　·
        <br />
        　　　·　　　✦
      </div>
      <Logo large />
      <p>Life is funny. React to it.</p>
      <div className="loading">
        <i />
      </div>
      <small>SHUFFLING THE DECK...</small>
    </Screen>
  )
}
