import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  children: React.ReactNode
}

const baseStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s',
}

const variants = {
  primary: { backgroundColor: '#007bff', color: 'white' },
  secondary: { backgroundColor: '#6c757d', color: 'white' },
  danger: { backgroundColor: '#dc3545', color: 'white' },
}

const sizes = {
  small: { padding: '0.25rem 0.5rem', fontSize: '12px' },
  medium: { padding: '0.5rem 1rem', fontSize: '14px' },
  large: { padding: '0.75rem 1.5rem', fontSize: '16px' },
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  const buttonStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
    ...(disabled || loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
    ...style,
  }

  return (
    <button style={buttonStyle} disabled={disabled || loading} {...props}>
      {loading ? <span>Loading...</span> : children}
    </button>
  )
}

export default Button
