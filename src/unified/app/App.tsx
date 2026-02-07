import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import UnifiedProviders from './providers';
import UnifiedRouter from './router';

const App: React.FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <UnifiedProviders>
        <UnifiedRouter />
      </UnifiedProviders>
    </BrowserRouter>
  );
};

export default App;
