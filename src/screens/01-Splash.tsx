import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { HomeBar, Logo } from '../components'
import { paths } from '../lib/routes'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate(paths.onboarding), 1900)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="screen splash">
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
      <HomeBar />
    </div>
  )
}
