import React from 'react';
import { Navigate } from 'react-router-dom';

interface SecurityGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const SecurityGuard: React.FC<SecurityGuardProps> = ({ children, requireAuth = true }) => {
  if (requireAuth) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  }
  return <>{children}</>;
};

export default SecurityGuard;
