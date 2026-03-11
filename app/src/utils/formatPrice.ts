interface FormatPriceOptions {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

const DEFAULT_OPTIONS: Required<FormatPriceOptions> = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

export const formatPrice = (value: number, options?: FormatPriceOptions): string => {
  const merged = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: merged.minimumFractionDigits,
    maximumFractionDigits: merged.maximumFractionDigits,
  }).format(value)
}
