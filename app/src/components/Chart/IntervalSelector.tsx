import { classNames } from '../../utils/classNames'

const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'] as const

interface IntervalSelectorProps {
  value: string
  onChange: (interval: string) => void
}

export const IntervalSelector = ({ value, onChange }: IntervalSelectorProps) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {INTERVALS.map((interval) => {
        const isActive = value === interval

        return (
          <button
            key={interval}
            type="button"
            className={classNames(isActive ? 'interval-active' : 'interval-inactive')}
            onClick={() => onChange(interval)}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: isActive ? 'var(--color-surface-alt)' : 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {interval}
          </button>
        )
      })}
    </div>
  )
}
