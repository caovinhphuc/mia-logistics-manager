import React from 'react';
import { useLayout } from '../context/LayoutContext';

const DebugLayout: React.FC = () => {
  try {
    const context = useLayout();

    console.log('🔍 Layout Context Debug:', {
      context: !!context,
      pages: context?.pages?.length || 0,
      dashboard: context?.getPageById?.('dashboard'),
      themeClasses: !!context?.themeClasses
    });

    return (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-400 mb-4">
        <h3 className="font-bold text-yellow-800">Layout Context Debug</h3>
        <div className="text-sm mt-2 space-y-1">
          <div>✅ Context loaded: {context ? 'Yes' : 'No'}</div>
          <div>📄 Pages count: {context?.pages?.length || 0}</div>
          <div>🏠 Dashboard exists: {context?.getPageById?.('dashboard') ? 'Yes' : 'No'}</div>
          <div>🎨 Theme classes: {context?.themeClasses ? 'Yes' : 'No'}</div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-400 mb-4">
        <h3 className="font-bold text-red-800">Layout Context Error</h3>
        <div className="text-sm mt-2 text-red-700">
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
};

export default DebugLayout;
