import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button, Icon, Logo, Screen, toast } from '../components'
import { feedback } from '../lib/feedback'
import { paths } from '../lib/routes'
import { googleSignInUrl, supabaseConfigured } from '../lib/supabase'
import { sessionApi } from '../state/gameStore'

type Mode = 'signup' | 'login'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function SignUp() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>(() => (location.state as { mode?: Mode } | null)?.mode ?? 'signup')
  const [name, setName] = useState('Kofi Mensah')
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [terms, setTerms] = useState(false)
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)
  const signup = mode === 'signup'

  const contactOk =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || /^0\d{9}$/.test(contact.replace(/\s/g, ''))
  const passOk = pass.length >= 8

  const switchMode = (next: Mode) => {
    setMode(next)
    setTried(false)
  }

  const submit = async () => {
    setTried(true)
    const ok = signup ? contactOk && passOk && terms && name.trim().length > 0 : contactOk && passOk
    if (!ok) {
      feedback.error()
      return
    }
    setBusy(true)
    await sleep(700) // mock network delay
    if (signup) {
      sessionApi.signUp({ name: name.trim(), contact })
      navigate(paths.profileSetup)
    } else {
      sessionApi.logIn({ contact })
      toast('Welcome back')
      navigate(paths.home)
    }
  }

  const google = () => {
    if (!supabaseConfigured) {
      toast('Google sign-in is coming soon.')
      return
    }
    setGoogleBusy(true)
    window.location.assign(googleSignInUrl())
  }

  return (
    <Screen
      className="signup"
      foot={
        <Button cta loading={busy} onClick={submit}>
          {signup ? 'Create account' : 'Log in'}　→
        </Button>
      }
    >
      <Logo />
      <div className="auth-tabs" role="tablist" aria-label="Account">
        <button type="button" role="tab" aria-selected={signup} onClick={() => switchMode('signup')}>
          Sign up
        </button>
        <button type="button" role="tab" aria-selected={!signup} onClick={() => switchMode('login')}>
          Log in
        </button>
      </div>
      <div key={mode} className="auth-form">
        <h1>{signup ? 'Make your account' : 'Welcome back'}</h1>
        <p className="muted">
          {signup
            ? 'You need an account to play. No guest mode, sorry!'
            : 'Log in to get back to your squad and your stats.'}
        </p>
        {signup && (
          <div className="field">
            <label htmlFor="signup-name">DISPLAY NAME</label>
            <input
              id="signup-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 16))}
            />
            {tried && !name.trim() && <p className="error-text">Pick a display name.</p>}
          </div>
        )}
        <div className="field">
          <label htmlFor="auth-contact">EMAIL OR PHONE NUMBER</label>
          <input
            id="auth-contact"
            className={`input ${tried && !contactOk ? 'error' : ''}`}
            placeholder="024 123 4567"
            autoComplete="username"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          {tried && !contactOk && (
            <p className="error-text">That doesn't look like an email or Ghana number. Try 024 xxx xxxx</p>
          )}
        </div>
        <div className="field">
          <label htmlFor="auth-password">PASSWORD</label>
          <div className="pw-wrap">
            <input
              id="auth-password"
              className={`input ${tried && !passOk ? 'error' : ''}`}
              type={showPass ? 'text' : 'password'}
              autoComplete={signup ? 'new-password' : 'current-password'}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              className="eye"
              aria-label={showPass ? 'Hide password' : 'Show password'}
              aria-pressed={showPass}
              onClick={() => setShowPass(!showPass)}
            >
              <Icon name={showPass ? 'eyeoff' : 'eye'} size={20} />
            </button>
          </div>
          {signup && (
            <div className="strength">
              {[0, 1, 2, 3].map((i) => (
                <i className={pass.length > i * 3 ? 'on' : ''} key={i} />
              ))}
            </div>
          )}
          {tried && !passOk && <p className="error-text">Use at least 8 characters.</p>}
        </div>
        {signup && (
          <>
            <label className="terms">
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              <i>
                <Icon name="check" size={15} />
              </i>{' '}
              I agree to the <u>Terms</u> and <u>Privacy Policy</u>
            </label>
            {tried && !terms && <p className="error-text">Tick the box to continue.</p>}
          </>
        )}
        <div className="or">OR</div>
        <Button variant="secondary" loading={googleBusy} onClick={google}>
          G　 Continue with Google
        </Button>
        <p className="login-hint">
          {signup ? (
            <>
              Wait, I actually have an account.{' '}
              <button type="button" className="link" onClick={() => switchMode('login')}>
                Log in here
              </button>
            </>
          ) : (
            <>
              New here?{' '}
              <button type="button" className="link" onClick={() => switchMode('signup')}>
                Create an account
              </button>
            </>
          )}
        </p>
      </div>
    </Screen>
  )
}
