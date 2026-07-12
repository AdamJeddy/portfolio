import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="content-layer">
      <section className="section first">
        <div className="col wfull">
          <p
            className="mega"
            style={{ fontFamily: 'var(--font-geist-mono), var(--font-mono)', fontSize: 'calc(var(--font-size) * 6)' }}
          >
            404
          </p>
          <p
            style={{
              fontFamily: 'var(--font-geist-mono), var(--font-mono)',
              textTransform: 'uppercase',
              marginTop: 'var(--line-px)',
              opacity: 0.5,
            }}
          >
            Page not found
          </p>
          <div style={{ marginTop: 'calc(var(--line-px) * 3)' }}>
            <Link href="/" className="button">
              ← Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
