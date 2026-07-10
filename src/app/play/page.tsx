export default function PlayPage() {
  return (
    <div className="content-layer">
      <section className="section first">
        <div className="col w5">
          <p className="mega">Play.</p>
          <p style={{ marginTop: 'var(--line-px)' }}>
            Terminal experiments and ASCII games — coming soon.
          </p>
        </div>
      </section>

      <section className="section space">
        <div className="col w4">
          <div className="linelist" style={{ marginTop: 'calc(var(--line-px) * 2)' }}>
            <p style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
              marginBottom: 'var(--line-px)',
            }}>
              ● TEXT RIS &nbsp;&nbsp;&nbsp;Coming soon
            </p>
            <p style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
            }}>
              ○ SNEK ST &nbsp;&nbsp;&nbsp;Coming soon
            </p>
            <p style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
            }}>
              ○ PAK KU &nbsp;&nbsp;&nbsp;Coming soon
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
