import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Chip, Confetti, CountUp, Icon, Modal, Reaction, Screen, toast } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
import { feedback } from '../lib/feedback'
import { paths } from '../lib/routes'
import { gameApi } from '../state/gameStore'

export default function GameOver() {
  const navigate = useNavigate()
  const [share, setShare] = useState(false)

  useEffect(() => feedback.win(), [])

  const playAgain = () => {
    const room = gameApi.playAgain()
    navigate(paths.room(room.code), { replace: true })
  }
  const backHome = () => {
    gameApi.leaveRoom()
    navigate(paths.home)
  }
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      toast('Link copied')
    } catch {
      toast("Couldn't copy automatically. Copy the address from your browser instead.", 'error')
    }
    setShare(false)
  }

  return (
    <Screen
      className="gameover"
      foot={
        <Button cta onClick={playAgain}>
          PLAY AGAIN
        </Button>
      }
    >
      <Confetti />
      <h4>GAME OVER</h4>
      <span className="round-pill">FIRST TO 5</span>
      <div className="champ">
        ♛<span>🤩</span>
        <b>Ama</b>
        <em>
          <CountUp value={5} /> pts
        </em>
      </div>
      <div className="podium">
        <div>
          <span>😎</span>
          <b>
            Kofi
            <br />
            <CountUp value={4} /> pts
          </b>
          <i>2</i>
        </div>
        <div>
          <span>🤩</span>
          <b>
            Ama
            <br />
            <CountUp value={5} /> pts
          </b>
          <i>1</i>
        </div>
        <div>
          <span>🥳</span>
          <b>
            Yaw
            <br />
            <CountUp value={3} /> pts
          </b>
          <i>3</i>
        </div>
      </div>
      <div className="funniest">
        <Reaction mini card={reactionCards[0]} />
        <div>
          <small>FUNNIEST CARD OF THE NIGHT</small>
          <h2>The Ultimate Clout</h2>
          <p>by Kofi</p>
          <b>3 wins with this card</b>
        </div>
      </div>
      <div className="badges">
        <Chip color="mint">🏆 FIRST WIN</Chip>
        <Chip color="yellow">♥ CROWD FAVOURITE</Chip>
      </div>
      <Button variant="secondary" onClick={() => setShare(true)}>
        <Icon name="share" />　SHARE RESULT
      </Button>
      <button type="button" className="back-home" onClick={backHome}>
        BACK TO HOME
      </button>
      {share && (
        <Modal title="Share your result" onClose={() => setShare(false)}>
          <p className="muted">Your winner card is ready to share.</p>
          <Button onClick={copyLink}>COPY LINK</Button>
        </Modal>
      )}
    </Screen>
  )
}
