import type { Session } from '../state/gameStore'

/** The signed-in user's face: uploaded photo if there is one, otherwise the chosen emoji. */
export function FaceAvatar({ session }: { session: Pick<Session, 'avatar' | 'photo'> }) {
  return session.photo ? (
    <img className="face-photo" src={session.photo} alt="Your photo" />
  ) : (
    <span role="img" aria-label="Your avatar">
      {session.avatar}
    </span>
  )
}
