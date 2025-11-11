import React from 'react';
import ReactDOM from 'react-dom/client';
import { SecurityProvider } from './contexts/SecurityContext';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <SecurityProvider>
      <App />
    </SecurityProvider>
  </React.StrictMode>
);
