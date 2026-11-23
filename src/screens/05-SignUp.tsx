import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, HomeBar, Icon, Logo } from '../components'
import { paths } from '../lib/routes'

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('Kofi Mensah')
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [terms, setTerms] = useState(false)
  const [tried, setTried] = useState(false)

  const valid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || /^0\d{9}$/.test(contact.replace(/\s/g, ''))

  const submit = () => {
    setTried(true)
    if (valid && pass.length >= 8 && terms && name) navigate(paths.profileSetup)
  }

  return (
    <div className="screen scroll signup">
      <Logo />
      <div className="auth-tabs">
        <button type="button">Sign up</button>
        <button type="button">Log in</button>
      </div>
      <h1>Make your account</h1>
      <p className="muted">You need an account to play. No guest mode, sorry!</p>
      <div className="field">
        <label htmlFor="signup-name">DISPLAY NAME</label>
        <input
          id="signup-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 16))}
        />
      </div>
      <div className="field">
        <label htmlFor="signup-contact">EMAIL OR PHONE NUMBER</label>
        <input
          id="signup-contact"
          className={`input ${tried && !valid ? 'error' : ''}`}
          placeholder="024 123 4567"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        {tried && !valid && (
          <p className="error-text">That doesn't look like an email or Ghana number. Try 024 xxx xxxx</p>
        )}
      </div>
      <div className="field">
        <label htmlFor="signup-password">PASSWORD</label>
        <input
          id="signup-password"
          className="input"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="At least 8 characters"
        />
        <div className="strength">
          {[0, 1, 2, 3].map((i) => (
            <i className={pass.length > i * 3 ? 'on' : ''} key={i} />
          ))}
        </div>
      </div>
      <label className="terms">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <i>
          <Icon name="check" size={15} />
        </i>{' '}
        I agree to the <u>Terms</u> and <u>Privacy Policy</u>
      </label>
      <Button onClick={submit}>Create account　→</Button>
      <div className="or">OR</div>
      <Button variant="secondary">G　 Continue with Google</Button>
      <p className="login-hint">
        Wait, I actually have an account. <b>Log in here</b>
      </p>
      <HomeBar />
    </div>
  )
}
