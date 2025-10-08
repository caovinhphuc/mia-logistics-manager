import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import contexts
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider as CustomThemeProvider } from './hooks/useTheme';

// Import main App component
import App from './App';

// Import global styles
import './index.css';

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <CustomThemeProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </CustomThemeProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
