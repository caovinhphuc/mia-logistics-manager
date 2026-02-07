import React from 'react';

const HeaderDebug = ({ onLayoutConfigOpen, ...otherProps }) => {
  const handleTestClick = () => {
    console.log('=== LAYOUT CONFIG DEBUG ===');
    console.log('onLayoutConfigOpen function:', onLayoutConfigOpen);
    console.log('typeof onLayoutConfigOpen:', typeof onLayoutConfigOpen);
    console.log('Other props:', Object.keys(otherProps));

    if (onLayoutConfigOpen && typeof onLayoutConfigOpen === 'function') {
      console.log('✅ Calling onLayoutConfigOpen...');
      onLayoutConfigOpen();
      alert('✅ Layout Config function called successfully!');
    } else {
      console.error('❌ onLayoutConfigOpen is not a function or undefined');
      alert('❌ Layout Config function is missing or invalid!');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="text-sm font-bold mb-2">Header Debug Panel</div>
      <div className="text-xs mb-2">
        onLayoutConfigOpen: {onLayoutConfigOpen ? '✅ Found' : '❌ Missing'}
      </div>
      <button
        onClick={handleTestClick}
        className="bg-white text-red-500 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100"
      >
        Test Layout Config
      </button>
    </div>
  );
};

export default HeaderDebug;
