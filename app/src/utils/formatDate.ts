export const formatDate = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp)

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: '2-digit',
  }).format(date)
}
