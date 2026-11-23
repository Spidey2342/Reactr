export function ProgressDots({ index, total = 3 }: { index: number; total?: number }) {
  return (
    <div className="dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i className={i === index ? 'active' : ''} key={i} />
      ))}
    </div>
  )
}
