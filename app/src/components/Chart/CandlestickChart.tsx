import 'chartjs-adapter-date-fns'

import {
  Chart as ChartJS,
  type FinancialDataPoint,
  Legend,
  LinearScale,
  TimeScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import {
  CandlestickController,
  CandlestickElement,
} from 'chartjs-chart-financial'
import { Chart } from 'react-chartjs-2'

import type { HistoryPoint } from '../../types'
import { formatPrice } from '../../utils/formatPrice'

ChartJS.register(TimeScale, LinearScale, CandlestickController, CandlestickElement, Tooltip, Legend)

interface CandlestickChartProps {
  points: HistoryPoint[]
  isLoading: boolean
}

export const CandlestickChart = ({ points, isLoading }: CandlestickChartProps) => {
  if (isLoading) {
    return (
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: 24,
          background: 'var(--color-surface)',
        }}
      >
        Loading chart...
      </div>
    )
  }

  if (points.length === 0) {
    return (
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: 24,
          background: 'var(--color-surface)',
        }}
      >
        No chart data available.
      </div>
    )
  }

  const sorted = [...points].sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  const data = {
    datasets: [
      {
        label: 'OHLC',
        data: sorted.map(
          (point): FinancialDataPoint => ({
            x: new Date(point.timestamp).getTime(),
            o: point.open,
            h: point.high,
            l: point.low,
            c: point.close,
          }),
        ),
        color: {
          up: '#26c87a',
          down: '#f04f5e',
          unchanged: '#8b90a8',
        },
      },
    ],
  }

  const options: ChartOptions<'candlestick'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMM dd, HH:mm',
        },
        ticks: {
          color: '#8b90a8',
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(139, 144, 168, 0.15)',
        },
      },
      y: {
        ticks: {
          color: '#8b90a8',
          callback(value) {
            return formatPrice(Number(value), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          },
        },
        grid: {
          color: 'rgba(139, 144, 168, 0.15)',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#e8eaf0',
        },
      },
      tooltip: {
        callbacks: {
          label(context) {
            const raw = context.raw as FinancialDataPoint | undefined
            if (!raw) {
              return 'OHLC: --'
            }

            return `O ${formatPrice(raw.o)}  H ${formatPrice(raw.h)}  L ${formatPrice(raw.l)}  C ${formatPrice(raw.c)}`
          },
        },
      },
    },
  }

  return (
    <div
      style={{
        height: 360,
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 12,
        background: 'var(--color-surface)',
      }}
    >
      <Chart type="candlestick" data={data} options={options} />
    </div>
  )
}
