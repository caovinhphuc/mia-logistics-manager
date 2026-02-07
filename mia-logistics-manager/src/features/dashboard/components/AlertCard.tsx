import CloseIcon from '@mui/icons-material/Close'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import type { DashboardAlert } from '../types'

interface AlertCardProps {
  alert: DashboardAlert
  onDismiss?: (alertId: string) => Promise<void>
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onDismiss }) => {
  const [isDismissing, setIsDismissing] = React.useState(false)

  const handleDismiss = async () => {
    if (onDismiss) {
      try {
        setIsDismissing(true)
        await onDismiss(alert.id)
      } catch (error) {
        console.error('Failed to dismiss alert:', error)
      } finally {
        setIsDismissing(false)
      }
    }
  }

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'delivery':
        return '🚚'
      case 'inventory':
        return '📦'
      case 'vehicle':
        return '🚗'
      case 'system':
        return '⚙️'
      default:
        return '⚠️'
    }
  }

  return (
    <Alert
      severity={alert.severity}
      variant="outlined"
      sx={{ position: 'relative', pr: 5 }}
      action={
        <Button
          size="small"
          onClick={handleDismiss}
          disabled={isDismissing}
          sx={{ minWidth: 'auto' }}
        >
          <CloseIcon fontSize="small" />
        </Button>
      }
    >
      <Stack spacing={0.5}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            {getAlertIcon()} {alert.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
        <Typography variant="body2">{alert.message}</Typography>
        {alert.actionUrl && (
          <Button size="small" href={alert.actionUrl} variant="text" sx={{ mt: 0.5, p: 0 }}>
            View Details →
          </Button>
        )}
      </Stack>
    </Alert>
  )
}

export default AlertCard
