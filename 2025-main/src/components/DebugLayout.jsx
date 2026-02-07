import React from 'react';
import { useLayout } from '../context/LayoutContext';

const DebugLayout = () => {
  const context = useLayout();

  console.log('Layout Context Debug:', {
    context,
    pages: context?.pages,
    dashboard: context?.getPageById?.('dashboard'),
    themeClasses: context?.themeClasses
  });

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="font-bold">Layout Context Debug</h3>
      <pre className="text-xs mt-2 overflow-auto">
        {JSON.stringify({
          hasContext: !!context,
          pagesCount: context?.pages?.length || 0,
          dashboardExists: !!context?.getPageById?.('dashboard'),
          functions: Object.keys(context || {}).filter(key => typeof context[key] === 'function')
        }, null, 2)}
      </pre>
    </div>
  );
};

export default DebugLayout;
