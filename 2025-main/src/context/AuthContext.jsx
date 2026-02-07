import React, { createContext, useContext, useState, useCallback } from 'react';

// Criar e exportar o contexto
export const AuthContext = createContext();

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulação de chamada de API - substitua por sua lógica real
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Lógica de mock para autenticação
      if (email === 'admin@mia.vn' && password === '123456') {
        const userData = {
          id: 1,
          name: 'Admin',
          email,
          role: 'ADMIN',
          permissions: ['dashboard', 'orders', 'staff', 'analytics', 'settings', 'reports', 'permissions', 'profile']
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else if (email === 'manager@mia.vn' && password === '123456') {
        const userData = {
          id: 2,
          name: 'Gerente',
          email,
          role: 'MANAGER',
          permissions: ['dashboard', 'orders', 'staff', 'analytics', 'reports', 'profile']
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else if (email === 'staff@mia.vn' && password === '123456') {
        const userData = {
          id: 3,
          name: 'Funcionário',
          email,
          role: 'STAFF',
          permissions: ['dashboard', 'orders', 'profile']
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }

      throw new Error('Email ou senha inválidos');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  // Função para atualizar permissões do usuário
  const refreshUserPermissions = useCallback(() => {
    if (!user) return;

    // Aqui você poderia buscar permissões atualizadas da API
    // Por enquanto, apenas simularemos lendo do localStorage
    const savedRoles = localStorage.getItem('warehouse_roles');
    if (savedRoles) {
      try {
        const roles = JSON.parse(savedRoles);
        const userRole = roles[user.role];

        if (userRole && userRole.permissions) {
          setUser(prev => ({
            ...prev,
            permissions: userRole.permissions
          }));
        }
      } catch (err) {
        console.error('Erro ao atualizar permissões:', err);
      }
    }
  }, [user]);

  // Verificar se há usuário no localStorage ao inicializar
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: Boolean(user),
    refreshUserPermissions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// AuthProvider sẽ bao bọc toàn bộ ứng dụng để cung cấp context
