import React from 'react'

interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  style?: React.CSSProperties
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  padding: '1rem',
  borderBottom: '1px solid #e9ecef',
  fontWeight: 600,
  fontSize: '16px',
}

const bodyStyle: React.CSSProperties = {
  padding: '1rem',
}

const footerStyle: React.CSSProperties = {
  padding: '1rem',
  borderTop: '1px solid #e9ecef',
  backgroundColor: '#f8f9fa',
}

export const Card: React.FC<CardProps> = ({ title, children, footer, style }) => {
  return (
    <div style={{ ...cardStyle, ...style }}>
      {title && <div style={headerStyle}>{title}</div>}
      <div style={bodyStyle}>{children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  )
}

export default Card
