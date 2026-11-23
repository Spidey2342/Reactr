import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Chip, Confetti, HomeBar, Icon, Modal, Reaction } from '../components'
import { reactionCards } from '../data/dev-fixtures/reactionCards' // DEV FIXTURE
import { paths } from '../lib/routes'
import { gameApi } from '../state/gameStore'

export default function GameOver() {
  const navigate = useNavigate()
  const [share, setShare] = useState(false)

  const playAgain = () => {
    const room = gameApi.playAgain()
    navigate(paths.room(room.code), { replace: true })
  }
  const backHome = () => {
    gameApi.leaveRoom()
    navigate(paths.home)
  }

  return (
    <div className="screen scroll gameover">
      <Confetti />
      <h4>GAME OVER</h4>
      <span className="round-pill">FIRST TO 5</span>
      <div className="champ">
        ♛<span>🤩</span>
        <b>Ama</b>
        <em>5 pts</em>
      </div>
      <div className="podium">
        <div>
          <span>😎</span>
          <b>
            Kofi
            <br />4 pts
          </b>
          <i>2</i>
        </div>
        <div>
          <span>🤩</span>
          <b>
            Ama
            <br />5 pts
          </b>
          <i>1</i>
        </div>
        <div>
          <span>🥳</span>
          <b>
            Yaw
            <br />3 pts
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
      <Button onClick={playAgain}>PLAY AGAIN</Button>
      <Button variant="secondary" onClick={() => setShare(true)}>
        <Icon name="share" />　SHARE RESULT
      </Button>
      <button type="button" className="back-home" onClick={backHome}>
        BACK TO HOME
      </button>
      {share && (
        <Modal title="Share your result" onClose={() => setShare(false)}>
          <p className="muted">Your winner card is ready to share.</p>
          <Button onClick={() => setShare(false)}>COPY LINK</Button>
        </Modal>
      )}
      <HomeBar />
    </div>
  )
}
