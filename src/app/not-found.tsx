import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="content-layer">
      <section className="section first">
        <div className="col wfull not-found-content">
          <h1 className="not-found-code">404</h1>
          <p className="not-found-label">Page not found</p>
          <Link href="/" className="button">← Home</Link>
        </div>
      </section>
    </div>
  )
}
