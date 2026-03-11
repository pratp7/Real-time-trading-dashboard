export const AlertsPage = () => {
  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Alerts</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Protected user-specific alerts page. This route will host alert listing, create/update,
        delete, and detailed alert views.
      </p>

      <div
        style={{
          border: '1px dashed var(--color-border)',
          borderRadius: 12,
          padding: 20,
          background: 'var(--color-surface)',
        }}
      >
        <ul style={{ display: 'grid', gap: 8 }}>
          <li>View all alerts for the logged-in user</li>
          <li>Create new price alerts</li>
          <li>Edit alert threshold or condition</li>
          <li>Delete alerts</li>
        </ul>
      </div>
    </section>
  )
}
