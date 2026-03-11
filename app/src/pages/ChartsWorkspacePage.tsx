export const ChartsWorkspacePage = () => {
  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Charts Workspace</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Auth-protected route for charts, historical candles, and alert workflows.
      </p>

      <div
        style={{
          border: '1px dashed var(--color-border)',
          borderRadius: 12,
          padding: 20,
          background: 'var(--color-surface)',
        }}
      >
        <p>
          This workspace route is intentionally modular. New tools can be added here later, such
          as advanced indicators, portfolio panels, strategy runners, and additional chart tabs.
        </p>
      </div>
    </section>
  )
}
