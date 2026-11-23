export function Logo({ large = false }: { large?: boolean }) {
  return (
    <div className={`logo ${large ? 'large' : ''}`}>
      <span aria-hidden="true">😎</span>
      <b>REACTR</b>
    </div>
  )
}
