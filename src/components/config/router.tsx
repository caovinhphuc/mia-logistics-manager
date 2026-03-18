/**
 * Router configuration for the application
 * @returns {React.ReactNode} The router configuration
 */
import { createBrowserRouter } from 'react-router-dom';
import Profile from '../auth/Profile';
import NotFound from '../notfound/NotFound';
import MapView from '../maps/MapView';
import Settings from '../../pages/Settings/Settings';
import Reports from '../../pages/Reports/Reports';
export const router = createBrowserRouter([
  {
    path: '/maps',
    element: <MapView />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
