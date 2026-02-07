import React from 'react';

/**
 * Component utilizado apenas para desenvolvimento e depuração de permissões
 */
const DebugPermissions = ({ user }) => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-gray-800/90 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs">
      <div className="font-bold mb-1">Debug: Permissões</div>
      <div className="mb-2">Usuário: {user?.name || 'Não autenticado'}</div>
      <div className="mb-1">Permissões:</div>
      <ul className="list-disc pl-4">
        {user?.permissions?.map((perm) => (
          <li key={perm}>{perm}</li>
        )) || <li>Nenhuma permissão</li>}
      </ul>
    </div>
  );
};

export default DebugPermissions;
