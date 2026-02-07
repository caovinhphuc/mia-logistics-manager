import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color?: string
  trend?: number // percentage change
  unit?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#3f51b5',
  trend = 0,
  unit,
}) => {
  const isTrendPositive = trend > 0

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px ${color}30`,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.5 }}>
            {icon}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {unit && (
            <Typography variant="body2" color="text.secondary">
              {unit}
            </Typography>
          )}
        </Box>

        {trend !== 0 && (
          <Chip
            icon={isTrendPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${isTrendPositive ? '+' : ''}${trend}% vs last period`}
            size="small"
            variant="outlined"
            color={isTrendPositive ? 'success' : 'error'}
            sx={{ height: '24px' }}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
