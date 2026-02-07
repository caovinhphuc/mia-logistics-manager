// LayoutManager.jsx - Responsive Layout với Drag & Drop Widget Customization
import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Smartphone,
  Tablet,
  Monitor,
  Move,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Maximize,
  Minimize
} from 'lucide-react';
import PropTypes from 'prop-types';
import { BREAKPOINTS, useViewport } from '../../hooks/ResponsiveHelpers';
import { useLayout } from '../../context/LayoutContext';
import { renderWidget } from './WidgetRegistry';

const LayoutManager = ({ children, themeClasses, onLayoutChange, useLayoutContext = false, pageId = null, data = {}, metrics = {} }) => {
  console.log('LayoutManager rendered with:', { useLayoutContext, pageId });

  const [isDragging, setIsDragging] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingWidget, setResizingWidget] = useState(null);
  // State for resize direction and start position
  const [resizeDirection, setResizeDirection] = useState(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [layout, setLayout] = useState(() => {
    // Load layout từ localStorage hoặc default
    const saved = localStorage.getItem('warehouse-layout');
    return saved ? JSON.parse(saved) : getDefaultLayout();
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgetVisibility, setWidgetVisibility] = useState({});
  // Sử dụng useViewport hook để tự động phát hiện chế độ xem
  const viewport = useViewport();

  // Always call useLayout hook - React Hooks must be called in the same order
  const layoutContext = useLayout();

  // Use global view mode from LayoutContext only if useLayoutContext is true
  const { globalViewMode, setViewMode } = useLayoutContext ? layoutContext : {};
  console.log('View mode data:', { globalViewMode, setViewMode: !!setViewMode, useLayoutContext });
  const viewMode = (useLayoutContext && globalViewMode) ? globalViewMode : viewport.viewMode;
  const dragRef = useRef(null);
  const dropZoneRef = useRef(null);

  // ==================== COLLISION DETECTION & AUTO PLACEMENT ====================
  const isPositionOccupied = (widgets, row, col, width, height, excludeId = null) => {
    return widgets.some(widget => {
      if (widget.id === excludeId || !widget.visible) return false;

      // Check if the proposed position overlaps with existing widget
      return !(
        row >= widget.row + widget.height ||
        row + height <= widget.row ||
        col >= widget.col + widget.width ||
        col + width <= widget.col
      );
    });
  };

  const findAvailablePosition = (widgets, targetRow, targetCol, width, height, columns, excludeId = null) => {
    // Try the original target position first
    if (!isPositionOccupied(widgets, targetRow, targetCol, width, height, excludeId)) {
      return { row: targetRow, col: targetCol };
    }

    // Search for available position starting from target
    const maxRows = Math.max(...widgets.map(w => w.row + w.height), targetRow + height) + 5;

    for (let row = targetRow; row <= maxRows; row++) {
      for (let col = 0; col <= columns - width; col++) {
        if (!isPositionOccupied(widgets, row, col, width, height, excludeId)) {
          return { row, col };
        }
      }
    }

    // If no position found, place at the bottom
    const bottomRow = Math.max(...widgets.map(w => w.row + w.height), 0);
    return { row: bottomRow, col: 0 };
  };

  // ==================== DEFAULT LAYOUTS ====================
  function getDefaultLayout() {
    return {
      mobile: {
        columns: 1,
        widgets: [
          { id: 'stats', row: 0, col: 0, width: 1, height: 1, visible: true },
          { id: 'alerts', row: 1, col: 0, width: 1, height: 1, visible: true },
          { id: 'analytics', row: 2, col: 0, width: 1, height: 1, visible: true },
          { id: 'kpi', row: 3, col: 0, width: 1, height: 1, visible: true },
          { id: 'activities', row: 4, col: 0, width: 1, height: 1, visible: true },
          { id: 'schedule', row: 5, col: 0, width: 1, height: 2, visible: false }, // Hidden on mobile by default
          { id: 'performance', row: 7, col: 0, width: 1, height: 1, visible: false } // Hidden on mobile by default
        ]
      },
      tablet: {
        columns: 2,
        widgets: [
          { id: 'stats', row: 0, col: 0, width: 2, height: 1, visible: true },
          { id: 'alerts', row: 1, col: 0, width: 1, height: 1, visible: true },
          { id: 'analytics', row: 1, col: 1, width: 1, height: 1, visible: true },
          { id: 'kpi', row: 2, col: 0, width: 1, height: 1, visible: true },
          { id: 'activities', row: 2, col: 1, width: 1, height: 1, visible: true },
          { id: 'schedule', row: 3, col: 0, width: 2, height: 2, visible: true },
          { id: 'performance', row: 5, col: 0, width: 2, height: 1, visible: true }
        ]
      },
      desktop: {
        columns: 4,
        widgets: [
          { id: 'stats', row: 0, col: 0, width: 4, height: 1, visible: true },
          { id: 'schedule', row: 1, col: 0, width: 2, height: 3, visible: true },
          { id: 'analytics', row: 1, col: 2, width: 1, height: 1, visible: true },
          { id: 'kpi', row: 1, col: 3, width: 1, height: 1, visible: true },
          { id: 'alerts', row: 2, col: 2, width: 2, height: 1, visible: true },
          { id: 'activities', row: 3, col: 2, width: 1, height: 1, visible: true },
          { id: 'performance', row: 3, col: 3, width: 1, height: 1, visible: true }
        ]
      }
    };
  }  // ==================== RESPONSIVE DETECTION ====================
  useEffect(() => {
    // Sử dụng viewport từ useViewport hook để cập nhật global view mode
    if (setViewMode) {
      setViewMode(viewport.viewMode);
    }
  }, [viewport.viewMode, setViewMode]);

  // ==================== SAVE LAYOUT ====================
  useEffect(() => {
    // If using layout context, skip the local storage save
    if (useLayoutContext && pageId) return;

    localStorage.setItem('warehouse-layout', JSON.stringify(layout));
    if (onLayoutChange) {
      onLayoutChange(layout[viewMode]);
    }
  }, [layout, viewMode, onLayoutChange, useLayoutContext, pageId]);

  // ==================== DRAG & DROP HANDLERS ====================
  const handleDragStart = (e, widgetId) => {
    setIsDragging(true);
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', widgetId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };  const handleDrop = (e, targetRow, targetCol) => {
    e.preventDefault();
    setIsDragging(false);

    if (!draggedWidget) return;
    console.log('Handle drop:', { useLayoutContext, pageId, draggedWidget, targetRow, targetCol });

    if (useLayoutContext && pageId && layoutContext) {
      // Use layout context for drag and drop operations
      const layoutData = layoutContext.layouts[pageId]?.[viewMode];
      if (!layoutData) {
        console.error('Layout data not found for:', pageId, viewMode);
        return;
      }

      const draggedWidgetData = layoutData.widgets.find(w => w.id === draggedWidget);
      if (!draggedWidgetData) {
        console.error('Dragged widget not found:', draggedWidget);
        return;
      }

      // Find available position with collision detection
      const availablePosition = findAvailablePosition(
        layoutData.widgets,
        targetRow,
        targetCol,
        draggedWidgetData.width,
        draggedWidgetData.height,
        layoutData.columns,
        draggedWidget
      );

      console.log('Moving widget to position:', availablePosition);
      // Move to the available position
      layoutContext.moveWidget(pageId, viewMode, draggedWidget, availablePosition.row, availablePosition.col);

      setDraggedWidget(null);
      return;
    }

    // Local layout handling
    const currentLayout = layout[viewMode];
    const draggedWidgetData = currentLayout.widgets.find(w => w.id === draggedWidget);

    if (!draggedWidgetData) return;

    // Find available position with collision detection
    const availablePosition = findAvailablePosition(
      currentLayout.widgets,
      targetRow,
      targetCol,
      draggedWidgetData.width,
      draggedWidgetData.height,
      currentLayout.columns,
      draggedWidget
    );

    const newWidgets = currentLayout.widgets.map(widget =>
      widget.id === draggedWidget
        ? { ...widget, row: availablePosition.row, col: availablePosition.col }
        : widget
    );

    setLayout({
      ...layout,
      [viewMode]: {
        ...currentLayout,
        widgets: newWidgets
      }
    });

    setDraggedWidget(null);
  };

  // ==================== RESIZE HANDLERS ====================
  const handleResizeStart = (e, widgetId, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizingWidget(widgetId);
    setResizeDirection(direction);
    setResizeStartPos({ x: e.clientX, y: e.clientY });    const handleMouseMove = (moveEvent) => {
      if (!isResizing) return;

      const deltaX = moveEvent.clientX - resizeStartPos.x;
      const deltaY = moveEvent.clientY - resizeStartPos.y;

      // Calculate new dimensions based on direction
      let newWidth = 1;
      let newHeight = 1;

      // Get current layout
      const currentLayoutData = useLayoutContext && pageId && layoutContext.layouts[pageId]
        ? layoutContext.layouts[pageId][viewMode]
        : layout[viewMode];

      const currentWidget = currentLayoutData.widgets.find(w => w.id === widgetId);
      if (!currentWidget) return;

      if (direction.includes('e')) {
        // Resize width (right direction)
        newWidth = Math.max(1, currentWidget.width + Math.round(deltaX / 200)); // Adjust sensitivity
      } else {
        newWidth = currentWidget.width;
      }

      if (direction.includes('s')) {
        // Resize height (bottom direction)
        newHeight = Math.max(1, currentWidget.height + Math.round(deltaY / 150)); // Adjust sensitivity
      } else {
        newHeight = currentWidget.height;
      }      // Apply resize using context or local state
      if (useLayoutContext && pageId && layoutContext) {
        layoutContext.resizeWidget(pageId, viewMode, widgetId, newWidth, newHeight);
      } else {
        const currentLayoutObj = layout[viewMode];
        const newWidgets = currentLayoutObj.widgets.map(widget =>
          widget.id === widgetId
            ? { ...widget, width: newWidth, height: newHeight }
            : widget
        );

        setLayout({
          ...layout,
          [viewMode]: {
            ...currentLayoutObj,
            widgets: newWidgets
          }
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizingWidget(null);
      setResizeDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // ==================== WIDGET VISIBILITY ====================
  const toggleWidgetVisibility = (widgetId) => {
    if (useLayoutContext && pageId) {
      // Use the layout context to toggle visibility
      layoutContext.toggleWidgetVisibility(pageId, viewMode, widgetId);
      return;
    }

    const currentLayout = layout[viewMode];
    const newWidgets = currentLayout.widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, visible: !widget.visible }
        : widget
    );

    setLayout({
      ...layout,
      [viewMode]: {
        ...currentLayout,
        widgets: newWidgets
      }
    });
  };

  // ==================== RESET LAYOUT ====================
  const resetLayout = () => {
    if (useLayoutContext && pageId) {
      // Use the layout context to reset layout
      layoutContext.resetLayout(pageId);
      return;
    }

    const defaultLayout = getDefaultLayout();
    setLayout(defaultLayout);
  };
  // ==================== RENDER FUNCTIONS ====================
  // Get the current layout, either from local state or from context
  const currentLayout = useLayoutContext && pageId && layoutContext.layouts[pageId]
    ? layoutContext.layouts[pageId][viewMode]
    : layout[viewMode];  const renderLayoutControls = () => (
    <div className={`flex flex-col md:flex-row md:items-center gap-3 p-3 md:p-4 mb-4 rounded-lg ${themeClasses.surface} ${themeClasses.border} border`}>
      {/* View Mode Selector */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Giao diện:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          {[
            { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
            { mode: 'tablet', icon: Tablet, label: 'Tablet' },
            { mode: 'desktop', icon: Monitor, label: 'Desktop' }
          ].map(({ mode, icon: Icon, label }) => (            <button
              key={mode}
              onClick={() => {
                console.log('View mode button clicked:', mode, 'setViewMode available:', !!setViewMode);
                if (setViewMode) {
                  setViewMode(mode);
                  console.log('setViewMode called with:', mode);
                }
              }}
              className={`px-2 md:px-3 py-1.5 flex items-center gap-1 text-xs md:text-sm transition-colors ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : `${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover}`
              }`}
              title={`Chuyển sang chế độ ${label}`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Edit Mode Toggle - Always show */}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-2 md:px-3 py-1.5 rounded flex items-center gap-1 md:gap-2 text-xs md:text-sm transition-colors ${
            isEditMode
              ? 'bg-green-600 text-white'
              : `${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover}`
          }`}
          title={isEditMode ? 'Hoàn thành chỉnh sửa' : 'Chỉnh sửa layout'}
        >
          <Settings size={14} />
          <span className="hidden sm:inline">{isEditMode ? 'Hoàn thành' : 'Chỉnh sửa'}</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={resetLayout}
          className={`px-2 md:px-3 py-1.5 rounded flex items-center gap-1 md:gap-2 text-xs md:text-sm ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
          title="Đặt lại layout về mặc định"
        >
          <RotateCcw size={14} />
          <span className="hidden sm:inline">Đặt lại</span>
        </button>
      </div>

      {/* Widget Visibility Controls */}
      {isEditMode && (
        <div className="flex flex-wrap gap-1 md:ml-auto">
          <span className={`text-xs md:text-sm font-medium ${themeClasses.text.primary} mr-2`}>Ẩn/hiện:</span>
          {currentLayout.widgets.map(widget => (
            <button
              key={widget.id}
              onClick={() => toggleWidgetVisibility(widget.id)}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                widget.visible
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
              title={`${widget.visible ? 'Ẩn' : 'Hiện'} ${widget.id}`}
            >
              {widget.visible ? <Eye size={10} /> : <EyeOff size={10} />}
              <span className="capitalize">{widget.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
  const renderGrid = () => {
    const maxRows = Math.max(...currentLayout.widgets.map(w => w.row + w.height));
    const grid = Array(maxRows).fill().map(() => Array(currentLayout.columns).fill(null));

    // Place widgets in grid
    currentLayout.widgets.forEach(widget => {
      if (widget.visible) {
        for (let r = widget.row; r < widget.row + widget.height; r++) {
          for (let c = widget.col; c < widget.col + widget.width; c++) {
            if (grid[r] && grid[r][c] === null) {
              grid[r][c] = widget.id;
            }
          }
        }
      }
    });    // Responsive grid configuration
    const gridConfig = {
      mobile: {
        gap: '12px',
        minRowHeight: '200px',
        padding: '8px',
        widgetPadding: '8px'
      },
      tablet: {
        gap: '16px',
        minRowHeight: '220px',
        padding: '12px',
        widgetPadding: '12px'
      },
      desktop: {
        gap: '24px',
        minRowHeight: '240px',
        padding: '16px',
        widgetPadding: '16px'
      }
    };

    const config = gridConfig[viewMode];

    return (
      <div
        className={`grid`}
        style={{
          gridTemplateColumns: `repeat(${currentLayout.columns}, 1fr)`,
          gridAutoRows: `minmax(${config.minRowHeight}, auto)`,
          gap: config.gap,
          padding: config.padding
        }}
      >        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const widget = currentLayout.widgets.find(w =>
              w.visible && w.row === rowIndex && w.col === colIndex
            );

            if (!widget) {
              return isEditMode ? (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                  style={{ minHeight: config.minRowHeight }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Grid size={24} />
                    {isDragging && (
                      <span className="text-xs font-medium">
                        Thả để đặt widget
                      </span>
                    )}
                  </div>
                </div>
              ) : null;
            }

            const childElement = React.Children.toArray(children).find(
              child => child.props?.widgetId === widget.id
            );

            return (
              <div
                key={widget.id}
                className={`relative transition-all duration-200 ${
                  isEditMode ? 'hover:scale-[1.02] cursor-move' : ''
                } ${themeClasses.surface} ${themeClasses.border} border rounded-xl shadow-sm hover:shadow-md`}                style={{
                  gridRow: `${widget.row + 1} / span ${widget.height}`,
                  gridColumn: `${widget.col + 1} / span ${widget.width}`,
                  padding: config.widgetPadding
                }}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, widget.row, widget.col)}
              >                {isEditMode && (
                  <div className="absolute top-3 right-3 z-10 flex gap-1">
                    <button
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={widget.visible ? 'Ẩn widget' : 'Hiện widget'}
                    >
                      {widget.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <div className="p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-lg border cursor-grab active:cursor-grabbing">
                      <Move size={14} className="text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Resize handles in edit mode */}
                {isEditMode && (
                  <>
                    {/* Bottom-right resize handle */}
                    <div
                      className="absolute bottom-1 right-1 w-3 h-3 bg-blue-500 rounded-tl-lg cursor-se-resize opacity-70 hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleResizeStart(e, widget.id, 'se')}
                      title="Thay đổi kích thước"
                    >
                      <div className="w-full h-full flex items-end justify-end">
                        <div className="w-2 h-2 border-r-2 border-b-2 border-white"></div>
                      </div>
                    </div>
                    {/* Bottom resize handle */}
                    <div
                      className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-blue-500 rounded-t-lg cursor-s-resize opacity-70 hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleResizeStart(e, widget.id, 's')}
                      title="Thay đổi chiều cao"
                    >
                    </div>
                    {/* Right resize handle */}
                    <div
                      className="absolute top-1/2 right-1 transform -translate-y-1/2 w-2 h-6 bg-blue-500 rounded-l-lg cursor-e-resize opacity-70 hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleResizeStart(e, widget.id, 'e')}
                      title="Thay đổi chiều rộng"
                    >
                    </div>
                  </>
                )}                <div className={`h-full ${isEditMode ? 'pointer-events-none' : ''}`}>
                  {childElement || renderWidget(widget.id, { themeClasses, data, metrics })}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };
  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full">
      {renderLayoutControls()}

      <div
        ref={dropZoneRef}
        className={`transition-all duration-200 ${
          isDragging ? 'bg-blue-50 dark:bg-blue-900/10' : ''
        }`}
      >
        {renderGrid()}
      </div>

      {/* Edit Mode Help Panel */}
      {isEditMode && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${themeClasses.surface} ${themeClasses.border} border max-w-xs z-50`}>
          <div className={`text-sm font-medium ${themeClasses.text.primary} mb-2 flex items-center gap-2`}>
            <Settings size={16} />
            Hướng dẫn chỉnh sửa
          </div>
          <div className={`text-xs ${themeClasses.text.muted} space-y-2`}>
            <div className="flex items-start gap-2">
              <Move size={12} className="mt-0.5 flex-shrink-0" />
              <span>Kéo thả widget để di chuyển</span>
            </div>
            <div className="flex items-start gap-2">
              <Eye size={12} className="mt-0.5 flex-shrink-0" />
              <span>Click mắt để ẩn/hiện widget</span>
            </div>
            <div className="flex items-start gap-2">
              <Monitor size={12} className="mt-0.5 flex-shrink-0" />
              <span>Chuyển đổi giao diện cho từng thiết bị</span>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw size={12} className="mt-0.5 flex-shrink-0" />
              <span>Đặt lại về bố cục mặc định</span>
            </div>
          </div>
        </div>
      )}

      {/* Current Layout Info */}
      <div className={`mt-4 text-center text-xs ${themeClasses.text.muted}`}>
        Đang hiển thị: <span className="font-medium capitalize">{viewMode}</span> •
        Cột: <span className="font-medium">{currentLayout.columns}</span> •
        Widget hiển thị: <span className="font-medium">{currentLayout.widgets.filter(w => w.visible).length}</span>
      </div>
    </div>
  );
};

// ==================== PROP TYPES ====================
LayoutManager.propTypes = {  children: PropTypes.node.isRequired,
  themeClasses: PropTypes.object.isRequired,
  onLayoutChange: PropTypes.func,
  useLayoutContext: PropTypes.bool,
  pageId: PropTypes.string,
  data: PropTypes.object,
  metrics: PropTypes.object
};

export default LayoutManager;
