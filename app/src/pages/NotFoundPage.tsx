import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <section>
      <h1>Page Not Found</h1>
      <p style={{ color: 'var(--color-text-secondary)', margin: '12px 0' }}>
        The route does not exist.
      </p>
      <Link to="/dashboard">Go to dashboard</Link>
    </section>
  )
}
