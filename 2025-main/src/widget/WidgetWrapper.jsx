import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

const WidgetWrapper = ({
  widgetId,
  title,
  description,
  children,
  themeClasses = {},
  isExpandable = false,
  isRefreshable = false,
  isConfigurable = false,
  onRefresh,
  onConfig,
  className = '',
  headerActions
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing widget:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleConfig = () => {
    if (onConfig) {
      onConfig(widgetId);
    }
  };

  // Safe theme class access
  const cardClass = themeClasses?.card || 'bg-white border border-gray-200';
  const textPrimaryClass = themeClasses?.text?.primary || 'text-gray-900';
  const textSecondaryClass = themeClasses?.text?.secondary || 'text-gray-600';
  const surfaceClass = themeClasses?.surface || 'bg-white';
  const borderClass = themeClasses?.border || 'border-gray-200';

  return (
    <div
      className={`
        widget-wrapper
        ${cardClass}
        rounded-lg shadow-sm
        ${isFullscreen ? 'fixed inset-4 z-50' : ''}
        ${className}
      `}
      data-widget-id={widgetId}
    >
      {/* Widget Header */}
      <div className={`widget-header flex items-center justify-between p-4 border-b ${borderClass}`}>
        <div className="flex items-center gap-3">
          {isExpandable && (
            <button
              onClick={handleToggleExpand}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${textSecondaryClass}`}
              title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}

          <div>
            <h3 className={`font-semibold text-lg ${textPrimaryClass}`}>
              {title}
            </h3>
            {description && (
              <p className={`text-sm ${textSecondaryClass} mt-1`}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {headerActions}

          {isRefreshable && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`
                p-2 rounded hover:bg-gray-100 transition-colors
                ${textSecondaryClass}
                ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title="Làm mới"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}

          {isConfigurable && (
            <button
              onClick={handleConfig}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${textSecondaryClass}`}
              title="Cài đặt"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleToggleFullscreen}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${textSecondaryClass}`}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />

              
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Widget Content */}
      {isExpanded && (
        <div className={`widget-content ${surfaceClass}`}>
          {children}
        </div>
      )}

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleToggleFullscreen}
        />
      )}
    </div>
  );
};

WidgetWrapper.propTypes = {
  widgetId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  themeClasses: PropTypes.object,
  isExpandable: PropTypes.bool,
  isRefreshable: PropTypes.bool,
  isConfigurable: PropTypes.bool,
  onRefresh: PropTypes.func,
  onConfig: PropTypes.func,
  className: PropTypes.string,
  headerActions: PropTypes.node
};

export default WidgetWrapper;
