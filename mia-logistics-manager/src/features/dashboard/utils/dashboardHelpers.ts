/**
 * Dashboard Helper Functions
 */

/**
 * Format delivery time in minutes to readable format
 */
export const formatDeliveryTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

/**
 * Get status color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'delivered':
      return '#c8e6c9'
    case 'in_transit':
      return '#fff9c4'
    case 'pending':
      return '#ffccbc'
    case 'failed':
      return '#ffcdd2'
    default:
      return '#f5f5f5'
  }
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`
}

/**
 * Get performance trend label
 */
export const getTrendLabel = (trend: number): string => {
  if (trend > 0) {
    return `↑ +${trend}%`
  } else if (trend < 0) {
    return `↓ ${trend}%`
  }
  return '→ 0%'
}
