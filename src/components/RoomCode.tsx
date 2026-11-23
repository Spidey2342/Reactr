export function RoomCode({ code }: { code: string }) {
  const letters = code.padEnd(4, ' ').slice(0, 4).split('')
  return (
    <div className="room-code" aria-label={`Room code ${code}`}>
      {letters.map((letter, i) => (
        <b key={i}>{letter}</b>
      ))}
    </div>
  )
}
