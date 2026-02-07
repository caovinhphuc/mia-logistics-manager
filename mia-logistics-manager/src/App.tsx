import React from 'react'

const App: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#282c34',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀 MIA Logistics Manager</h1>
      <p style={{ fontSize: '1.2rem', color: '#61dafb' }}>Logistics Management System</p>
      <p style={{ marginTop: '2rem', color: '#999' }}>Built with React + TypeScript</p>
    </div>
  )
}

export default App
