/** Four tiles. With `typing`, the next empty tile gets a caret, like the Join Room design. */
export function RoomCode({ code, typing = false }: { code: string; typing?: boolean }) {
  const letters = code.padEnd(4, ' ').slice(0, 4).split('')
  return (
    <div className="room-code" aria-label={`Room code ${code}`}>
      {letters.map((letter, i) => (
        <b key={i} className={typing && i === code.length ? 'caret' : ''}>
          {letter}
        </b>
      ))}
    </div>
  )
}
