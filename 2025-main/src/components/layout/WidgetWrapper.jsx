// WidgetWrapper.jsx - Optimized wrapper for all widgets with responsive design
import { useState, useRef, useEffect } from 'react';

import {
  ArrowUpRight,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  ChevronsUp
} from 'lucide-react';



import { useViewport, BREAKPOINTS, Responsive } from '../../hooks/ResponsiveHelpers';



const WidgetWrapper = ({
  widgetId,
  title,
  description,
  children,
  themeClasses = {},
  isExpandable = false,
  isRefreshable = false,
  onRefresh,
  onToggleExpand,
  className = '',
  headerActions,
  isVisible = true,
  height = '400px',
  minHeight = '200px',
  maxHeight = 'none',
  aspectRatio = 'auto'

}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // State management for widget visibility, loading state, and menu toggle
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const wrapperRef = useRef(null);
  const [height, setHeight] = useState('400px');
  const [minHeight, setMinHeight] = useState('200px');
  const [maxHeight, setMaxHeight] = useState('none');
  const [aspectRatio, setAspectRatio] = useState('auto');
  // Ensure the widget has a unique ID for tracking
  useEffect(() => {
    if (!widgetId) {
      console.warn('WidgetWrapper requires a unique widgetId prop for tracking.');
    }
  }, [widgetId]);
  // Ensure the widget has a title for accessibility and identification
  useEffect(() => {
    if (!title) {
      console.warn('WidgetWrapper requires a title prop for accessibility and identification.');
    }
  }, [title]);

  // Ensure the widget has a description for better context
  useEffect(() => {
    if (!description) {
      console.warn('WidgetWrapper requires a description prop for better context.');
    }
  }, [description]);
  // Responsive viewport detection
  const { viewMode, isMobile, isTablet, isDesktop, width } = useViewport();
  // Enhanced theme classes with better visual balance and responsive considerations
  const defaultTheme = {
    surface: 'bg-white dark:bg-gray-800',
    surfaceHover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    border: 'border-gray-200 dark:border-gray-700',
    shadow: 'shadow-sm hover:shadow-md',
    text: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-700 dark:text-gray-300',
      muted: 'text-gray-600 dark:text-gray-400'
    },
    buttonSecondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    buttonSecondaryHover: 'bg-gray-200 dark:bg-gray-600',
    accent: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400'
  };

  const theme = { ...defaultTheme, ...themeClasses };

  // Responsive configuration based on viewport
  const getResponsiveConfig = () => {
    const config = {
      mobile: {

        borderRadius: 'rounded-lg',
        padding: {
          header: 'px-3 py-2.5',
          content: 'p-3'
        },
        fontSize: {
          title: 'text-sm',
          description: 'text-xs'
        },
        spacing: {
          headerGap: 'gap-1',
          contentGap: 'gap-2'
        },
        minHeight: '160px',
        iconSize: 12,
        buttonSize: 'p-1.5'
      },
      tablet: {
        borderRadius: 'rounded-xl',
        padding: {
          header: 'px-4 py-3',
          content: 'p-4'
        },
        fontSize: {
          title: 'text-base',
          description: 'text-sm'
        },
        spacing: {
          headerGap: 'gap-2',
          contentGap: 'gap-3'
        },
        minHeight: '200px',
        iconSize: 14,
        buttonSize: 'p-2'
      },
      desktop: {
        borderRadius: 'rounded-xl',
        padding: {
          header: 'px-5 py-4',
          content: 'p-6'
        },
        fontSize: {
          title: 'text-lg',
          description: 'text-sm'
        },
        spacing: {
          headerGap: 'gap-3',
          contentGap: 'gap-4'
        },
        minHeight: '240px',
        iconSize: 16,
        buttonSize: 'p-2'
      }
    };

    return config[viewMode] || config.desktop;
  };

  const responsiveConfig = getResponsiveConfig();

  // Set initial responsive styles based on viewport
  useEffect(() => {
    const updateStyles = () => {
      const styles = getContainerStyles();
      Object.assign(wrapperRef.current.style, styles);
    };

    updateStyles();
  }, [responsiveConfig, isExpanded]);


  // Handle initial visibility state
  useEffect(() => {
    setIsVisible(true);
  }, [widgetId]);

  // Handle initial expanded state
  useEffect(() => {
    setIsExpanded(false);
  }, [widgetId]);

  // Handle initial loading state
  useEffect(() => {
    setIsLoading(false);
  }, [widgetId]);

  // Handle initial showMenu state
  useEffect(() => {
    setShowMenu(false);
  }, [widgetId]);


  // Handle initial theme classes
  useEffect(() => {
    const themeClasses = { ...defaultTheme, ...themeClasses };
    Object.keys(themeClasses).forEach((key) => {
      wrapperRef.current.classList.add(themeClasses[key]);
    });
  }, [themeClasses]);

  // Handle initial aspect ratio
  useEffect(() => {

    if (wrapperRef.current) {
      wrapperRef.current.style.aspectRatio = aspectRatio;
    }
  }, [aspectRatio]);

  // Handle initial minHeight and maxHeight
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.minHeight = minHeight;
      wrapperRef.current.style.maxHeight = maxHeight;
      wrapperRef.current.style.minHeight = isExpanded ? 'auto' : minHeight;
      wrapperRef.current.style.maxHeight = isExpanded ? '90vh' : maxHeight;
      wrapperRef.current.style.aspectRatio = isExpanded ? 'auto' : aspectRatio;
    }
  }, [isExpanded, minHeight, maxHeight, aspectRatio]);
  // Handle initial visibility state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.display = isVisible ? 'block' : 'none';
    }
  }, [isVisible]);


  // Handle initial isMobile state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.toggle('mobile', isMobile);
    }
  }, [isMobile]);

  // Handle initial isTablet state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.toggle('tablet', isTablet);

    }
  }, [isTablet]);

  // Handle initial isDesktop state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.toggle('desktop', isDesktop);
    }
  }, [isDesktop]);


  // Handle initial width state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.width = isMobile ? '100%' : width > 1200 ? '800px' : '100%';
    }
  }, [width, isMobile]);
  // Handle initial height state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.height = isMobile ? '100%' : height > 800 ? '600px' : '100%';
    }
  }, [height, isMobile]);

  // Handle initial border radius state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.borderRadius = isMobile ? '0' : '12px';
    }
  }, [isMobile]);


  // Handle initial padding state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.padding = isMobile ? '12px' : '16px';
    }
  }, [isMobile]);

  // Handle initial font size state
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.fontSize = isMobile ? '14px' : '16px';
    }
  }, [isMobile]);




  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Refresh handler
  useEffect(() => {
    const handleRefresh = async () => {
      if (!onRefresh || isLoading) return;

      setIsLoading(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Widget refresh failed:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300); // Minimum loading time for better UX
      }
    };

    return () => {
      handleRefresh();
    };
  }, [onRefresh, isLoading]);
  // Toggle expand handler
  const handleExpandToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggleExpand) {
      onToggleExpand(newExpandedState);
    }
  };

  const handleToggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggleExpand) {
      onToggleExpand(newExpandedState);
    }
  };
  const handleRefresh = async () => {
    if (!onRefresh || isLoading) return;

    setIsLoading(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Widget refresh failed:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 300); // Minimum loading time for better UX
    }
  };

  // Toggle visibility handler
  // This function toggles the visibility of the widget



  const handleToggleVisibility = () => {
    if (!wrapperRef.current) return;
    // Toggle visibility state
    wrapperRef.current.style.display = isVisible ? 'none' : 'block';
    // Update the state

    setIsVisible(!isVisible);
  };
  const getContainerStyles = () => {
    // Base styles for the widget container
    if (!wrapperRef.current) return {};
    const isMobile = wrapperRef.current.classList.contains('mobile');
    const isTablet = wrapperRef.current.classList.contains('tablet');
    const isDesktop = wrapperRef.current.classList.contains('desktop');
    const responsiveConfig = getResponsiveConfig();
    const maxHeight = isExpanded ? '90vh' : (responsiveConfig.maxHeight || 'none');

    const aspectRatio = isExpanded ? 'auto' : (responsiveConfig.aspectRatio || 'auto');
    const minHeight = isExpanded ? 'auto' : (responsiveConfig.minHeight || '200px');
    // Use the base minHeight from responsiveConfig
    if (!responsiveConfig.minHeight) {
      console.warn('Responsive config minHeight is not defined, using default 200px');
      responsiveConfig.minHeight = '200px';
    }
    // Ensure minHeight is set correctly
    if (minHeight === '200px' && !responsiveConfig.minHeight) {
      console.warn('Using default minHeight of 200px as responsiveConfig.minHeight is not defined');
      responsiveConfig.minHeight = '200px';
    }
    // Use the base minHeight from responsiveConfig
    if (!responsiveConfig.minHeight) {
      console.warn('Using default minHeight of 200px as responsiveConfig.minHeight is not defined');
      responsiveConfig.minHeight = '200px';
    }

    const baseMinHeight = responsiveConfig.minHeight;

    const baseStyles = {
      minHeight: isExpanded ? 'auto' : (minHeight === '200px' ? baseMinHeight : minHeight),
      maxHeight: isExpanded ? '90vh' : maxHeight,
      aspectRatio: isExpanded ? 'auto' : aspectRatio
    };

    // Add responsive-specific styles
    if (isMobile && isExpanded) {
      baseStyles.width = '100%';
      baseStyles.height = '100%';
      baseStyles.position = 'fixed';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 100;
    } else if (isMobile) {
      baseStyles.width = '100%';
      baseStyles.height = '100%';
      baseStyles.position = 'relative';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 50;
    } else if (isTablet) {
      baseStyles.width = '100%';
      baseStyles.height = '100%';
      baseStyles.position = 'relative';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 50;
    } else if (isDesktop) {
      baseStyles.width = '800px';
      baseStyles.height = '600px';
      baseStyles.position = 'relative';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 50;
    } else {
      baseStyles.width = '100%';
      baseStyles.height = '100%';
      baseStyles.position = 'relative';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 50;
      baseStyles.padding = '16px';
      baseStyles.borderRadius = responsiveConfig.borderRadius;
      baseStyles.boxShadow = theme.shadow;
      baseStyles.backgroundColor = theme.surface;
      baseStyles.border = theme.border;
      baseStyles.display = 'flex';
      baseStyles.flexDirection = 'column';
      baseStyles.justifyContent = 'flex-start';
      baseStyles.alignItems = 'stretch';
      baseStyles.overflow = 'hidden';
      baseStyles.position = isExpanded ? 'fixed' : 'relative';
      baseStyles.width = isExpanded ? '100%' : '800px';
      baseStyles.height = isExpanded ? '100%' : '600px';
      baseStyles.padding = isExpanded ? '0' : responsiveConfig.padding.content;
      baseStyles.position = isExpanded ? 'fixed' : 'relative';
      baseStyles.top = isExpanded ? '0' : 'auto';
      baseStyles.left = isExpanded ? '0' : 'auto';
      baseStyles.right = isExpanded ? '0' : 'auto';
      baseStyles.bottom = isExpanded ? '0' : 'auto';
      baseStyles.borderRadius = responsiveConfig.borderRadius;
      baseStyles.boxShadow = isExpanded ? '0 0 10px rgba(0, 0, 0, 0.1)' : theme.shadow;
      baseStyles.backgroundColor = theme.surface;
      baseStyles.border = theme.border;
      baseStyles.display = 'flex';
      baseStyles.flexDirection = 'column';
      baseStyles.justifyContent = 'flex-start';
      baseStyles.alignItems = 'stretch';
      baseStyles.overflow = 'hidden';
      baseStyles.padding = isExpanded ? '0' : responsiveConfig.padding.content;
      baseStyles.position = isExpanded ? 'fixed' : 'relative';
      baseStyles.width = isExpanded ? '100%' : '800px';
      baseStyles.height = isExpanded ? '100%' : '600px';
      baseStyles.padding = isExpanded ? '0' : responsiveConfig.padding.content;
      baseStyles.position = isExpanded ? 'fixed' : 'relative';
      baseStyles.width = isExpanded ? '100%' : '800px';
      baseStyles.height = isExpanded ? '100%' : '600px';
      baseStyles.padding = isExpanded ? '0' : responsiveConfig.padding.content;
      baseStyles.position = isExpanded ? 'fixed' : 'relative';
      baseStyles.width = isExpanded ? '100%' : '800px';
      baseStyles.height = isExpanded ? '100%' : '600px';
      baseStyles.padding = isExpanded ? '0' : responsiveConfig.padding.content;
      baseStyles.position = isExpanded ? 'fixed' : 'relative';
      baseStyles.top = '8px';
      baseStyles.left = '8px';
      baseStyles.right = '8px';
      baseStyles.bottom = '8px';
      baseStyles.zIndex = 50;
      baseStyles.borderRadius = responsiveConfig.borderRadius;
      baseStyles.boxShadow = isExpanded ? '0 0 10px rgba(0, 0, 0, 0.1)' : theme.shadow;
      baseStyles.backgroundColor = theme.surface;
      baseStyles.border = theme.border;
      baseStyles.display = 'flex';
      baseStyles.flexDirection = 'column';
      baseStyles.justifyContent = 'flex-start';
      baseStyles.alignItems = 'stretch';
      baseStyles.overflow = 'hidden';
      baseStyles.padding = isExpanded ? '0' : responsiveConfig.padding.content;
    }

    // Add responsive-specific styles
    if (isMobile) {
      baseStyles.width = '100%';
      baseStyles.height = '100%';
      baseStyles.position = 'fixed';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 100;
    }

    if (isTablet) {
      baseStyles.width = '100%';
      baseStyles.height = '100%';
      baseStyles.position = 'relative';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 50;
    }


    if (isDesktop) {
      baseStyles.width = '800px';
      baseStyles.height = '600px';
      baseStyles.position = 'relative';
      baseStyles.top = '0';
      baseStyles.left = '0';
      baseStyles.right = '0';
      baseStyles.bottom = '0';
      baseStyles.zIndex = 50;
    }

    // Ensure minHeight is set correctly
    if (minHeight === '200px' && !responsiveConfig.minHeight) {
      console.warn('Using default minHeight of 200px as responsiveConfig.minHeight is not defined');
      responsiveConfig.minHeight = '200px';
    }
    return baseStyles;
  };

  // Auto-hide certain features on mobile for better UX
  const shouldShowFeature = (feature) => {
    if (!feature) return true; // Always show if no feature specified
    const isMobile = wrapperRef.current && wrapperRef.current.classList.contains('mobile');
    const isTablet = wrapperRef.current && wrapperRef.current.classList.contains('tablet');
    const isDesktop = wrapperRef.current && wrapperRef.current.classList.contains('desktop');
    const responsiveConfig = getResponsiveConfig();
    // Define features that should be hidden on mobile
    const mobileHiddenFeatures = ['headerActions', 'description', 'expandableIcon'];
    const tabletHiddenFeatures = ['headerActions', 'description'];
    const desktopHiddenFeatures = ['headerActions'];
    // Check if the feature should be hidden based on the current viewport
    if (isMobile && mobileHiddenFeatures.includes(feature)) {
      return false;

    }
    if (isTablet && tabletHiddenFeatures.includes(feature)) {
      return false;
    }
    if (isDesktop && desktopHiddenFeatures.includes(feature)) {
      return false;
    }
    // If the feature is not in the hidden list for the current viewport, show it

    return true;
  };  return (
    <div
      ref={wrapperRef}
      className={`
        group
        relative
        ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
        ${isExpanded && isMobile ? '' : (isExpanded ? 'fixed inset-4 z-50' : 'h-full')}
        ${isExpanded ? 'w-full' : 'w-full max-w-4xl mx-auto'}
        ${isExpanded ? 'h-full' : 'h-[400px]'}
        ${isExpanded ? 'overflow-hidden' : 'overflow-auto'}
        ${isExpanded ? 'bg-white dark:bg-gray-800' : theme.surface}
        ${isVisible ? 'opacity-100' : 'opacity-30'}
        ${responsiveConfig.borderRadius}
        ${theme.surface}
        ${theme.border}
        ${theme.shadow}
        border
        flex
        flex-col
        justify-between
        items-stretch
        relative
        overflow-hidden
        transition-all
        transform
        duration-300
        ease-in-out
        ${isMobile ? 'hover:shadow-lg' : 'hover:shadow-xl hover:scale-[1.02]'}
        ${isExpanded ? 'hover:scale-100' : ''}
        ${isExpanded ? 'hover:shadow-lg' : ''}
        ${isExpanded ? 'hover:scale-100' : ''}
        ${isExpanded ? 'hover:shadow-lg' : ''}
        ${isExpanded ? 'hover:scale-100' : ''}
        ${isExpanded ? 'hover:shadow-lg' : ''}
        ${className}
      `}
      style={getContainerStyles()}
      data-widget-id={widgetId}
    >
      {/* Responsive Header */}
      <div className={`
        relative
        ${responsiveConfig.padding.header}
        border-b
        ${theme.border}
        ${theme.surfaceHover}
        flex
        items-center
        justify-between
        ${isMobile ? 'min-h-[48px]' : isTablet ? 'min-h-[56px]' : 'min-h-[64px]'}
        backdrop-blur-sm
        ${isExpanded ? 'sticky top-0 z-10' : ''}
      `}>
        <div className="flex-1 min-w-0 pr-2">
          <div className={`flex items-center ${responsiveConfig.spacing.headerGap}`}>
            {!isVisible && (
              <EyeOff size={responsiveConfig.iconSize} className={`${theme.text.muted} flex-shrink-0`} />
            )}
            <h3 className={`
              ${responsiveConfig.fontSize.title}
              font-semibold
              ${theme.text.primary}
              truncate
              leading-tight
            `}>
              {title}
            </h3>
            {isExpandable && shouldShowFeature('expandableIcon') && (
              <ArrowUpRight
                size={responsiveConfig.iconSize - 2}
                className={`
                  ${theme.text.muted}
                  opacity-0 group-hover:opacity-100
                  transition-opacity
                  flex-shrink-0
                `}
              />
            )}
          </div>
          {description && shouldShowFeature('description') && (
            <p className={`
              ${responsiveConfig.fontSize.description}
              ${theme.text.muted}
              mt-1
              line-clamp-2
              leading-relaxed
            `}>
              {description}
            </p>
          )}
        </div>        {/* Responsive Header Actions */}
        <div className={`flex items-center ${responsiveConfig.spacing.headerGap}`}>
          {/* Custom Header Actions */}
          {headerActions && (
            <div className={`flex items-center ${responsiveConfig.spacing.headerGap} mr-1`}>
              {headerActions}
            </div>
          )}

          {/* Responsive Action Buttons */}
          <Responsive
            mobile={
              // Mobile: Show minimal actions in dropdown
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`
                    ${responsiveConfig.buttonSize}
                    rounded-lg
                    ${showMenu ? theme.accent + ' bg-blue-50 dark:bg-blue-900/20' : theme.buttonSecondary}
                    hover:${theme.buttonSecondaryHover}
                    transition-all
                    duration-200
                  `}
                  title="Tùy chọn"
                >
                  <MoreHorizontal size={ responsiveConfig.iconSize } />

                </button>
              </div>
            }
            tablet={
              // Tablet: Show key actions + dropdown

              <div className={`flex items-center ${responsiveConfig.spacing.headerGap}`}>
                {isRefreshable && (
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className={`
                      ${responsiveConfig.buttonSize}
                      rounded-lg
                      ${theme.buttonSecondary}
                      hover:${theme.buttonSecondaryHover}
                      transition-all
                      duration-200
                      disabled:opacity-50
                    `}
                    title="Làm mới"
                  >
                    <RefreshCw
                      size={responsiveConfig.iconSize}
                      className={isLoading ? 'animate-spin' : ''}
                    />
                  </button>
                )}
                {isExpandable && (
                  <button
                    onClick={handleToggleExpand}
                    className={`
                      ${responsiveConfig.buttonSize}
                      rounded-lg
                      ${isExpanded ? theme.accent + ' bg-blue-50 dark:bg-blue-900/20' : theme.buttonSecondary}
                      hover:${theme.buttonSecondaryHover}
                      transition-all
                      duration-200
                    `}
                    title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                  >
                    {isExpanded ? <Minimize2 size={responsiveConfig.iconSize} /> : <Maximize2 size={responsiveConfig.iconSize} />}
                  </button>
                )}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`
                    ${responsiveConfig.buttonSize}
                    rounded-lg
                    ${showMenu ? theme.accent + ' bg-blue-50 dark:bg-blue-900/20' : theme.buttonSecondary}
                    hover:${theme.buttonSecondaryHover}
                    transition-all
                    duration-200
                  `}
                  title="Tùy chọn thêm"
                >
                  <MoreHorizontal size={responsiveConfig.iconSize} />
                </button>
              </div>
            }
            desktop={
              // Desktop: Show all actions
              <div className={`flex items-center ${responsiveConfig.spacing.headerGap}`}>
                <button
                  onClick={handleToggleVisibility}
                  className={`
                    ${responsiveConfig.buttonSize}
                    rounded-lg
                    ${theme.buttonSecondary}
                    hover:${theme.buttonSecondaryHover}
                    transition-all
                    duration-200
                    opacity-0 group-hover:opacity-100
                  `}
                  title={isVisible ? 'Ẩn widget' : 'Hiện widget'}
                >
                  {isVisible ? <Eye size={responsiveConfig.iconSize} /> : <EyeOff size={responsiveConfig.iconSize} />}
                </button>

                {isRefreshable && (
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className={`
                      ${responsiveConfig.buttonSize}
                      rounded-lg
                      ${theme.buttonSecondary}
                      hover:${theme.buttonSecondaryHover}
                      transition-all
                      duration-200
                      disabled:opacity-50
                    `}
                    title="Làm mới dữ liệu"
                  >
                    <RefreshCw
                      size={responsiveConfig.iconSize}
                      className={isLoading ? 'animate-spin' : ''}
                    />
                  </button>
                )}

                {isExpandable && (
                  <button
                    onClick={handleToggleExpand}
                    className={`
                      ${responsiveConfig.buttonSize}
                      rounded-lg
                      ${isExpanded ? theme.accent + ' bg-blue-50 dark:bg-blue-900/20' : theme.buttonSecondary}
                      hover:${theme.buttonSecondaryHover}
                      transition-all
                      duration-200
                    `}
                    title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                  >
                    {isExpanded ? <Minimize2 size={responsiveConfig.iconSize} /> : <Maximize2 size={responsiveConfig.iconSize} />}
                  </button>
                )}

                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`
                    ${responsiveConfig.buttonSize}
                    rounded-lg
                    ${showMenu ? theme.accent + ' bg-blue-50 dark:bg-blue-900/20' : theme.buttonSecondary}
                    hover:${theme.buttonSecondaryHover}
                    transition-all
                    duration-200
                  `}
                  title="Tùy chọn thêm"
                >
                  <MoreHorizontal size={responsiveConfig.iconSize} />
                </button>
              </div>
            }
          />

            {/* Enhanced Dropdown Menu */}
            {showMenu && (
              <div className={`
                ${responsiveConfig.padding.content}
                ${responsiveConfig.spacing.contentGap}
                ${isMobile ? 'absolute top-12 right-0' : 'absolute top-full right-0'}
                ${isMobile ? 'w-full' : 'w-48'}
                ${isMobile ? 'left-0' : ''}
                ${isMobile ? 'z-50' : 'z-20'}
                ${isMobile ? 'mt-2' : 'mt-0'}
                ${isMobile ? 'rounded-lg' : 'rounded-xl'}
                ${isMobile ? theme.surface : theme.surfaceHover}
                ${isMobile ? theme.border : theme.border}
                ${isMobile ? theme.shadow : theme.shadow}
                ${isMobile ? 'shadow-lg' : ''}
                ${isMobile ? 'py-2' : 'py-2.5'}
                ${isMobile ? 'animate-in slide-in-from-top-2' : ''}
                ${isMobile ? 'duration-200' : ''}
                border
              `}>
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className={`text-xs font-medium ${theme.text.muted}`}>

                  <ChevronsUp size={ 14 } className="inline mr-1" />
                  <span className="inline">{title}</span>
                </p>
                  <p className={`text-xs ${theme.text.secondary}`}>
                  { description || 'No description available' }

                    <br />
                    Widget Actions
                  </p>
                </div>

                {isRefreshable && (
                  <button
                    onClick={() => {
                      handleRefresh();
                      setShowMenu(false);
                    }}
                    disabled={isLoading}
                    className={`
                      w-full
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      ${theme.text.primary}
                      hover:${theme.surfaceHover}

                      transition-colors
                      flex
                      items-center
                      gap-3
                      disabled:opacity-50
                    `}
                  >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    <span className="inline">
                      Làm mới dữ liệu
                  </span>
                  </button>
                )}

                {isExpandable && (
                  <button
                    onClick={() => {
                      handleToggleExpand();
                      setShowMenu(false);
                    }}
                    className={`
                      w-full
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      ${theme.text.primary}
                      hover:${theme.surfaceHover}
                      transition-colors
                      flex
                      items-center
                      gap-3
                    `}
                  >
                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    {isExpanded ? 'Thu nhỏ widget' : 'Phóng to widget'}
                  </button>
                )}

                <button
                  onClick={() => {
                    handleToggleVisibility();
                    setShowMenu(false);
                  }}
                  className={`
                    w-full
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    ${theme.text.primary}
                    hover:${theme.surfaceHover}
                    transition-colors
                    flex
                    items-center
                    gap-3
                  `}
                >
                  {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  {isVisible ? 'Ẩn widget' : 'Hiện widget'}
                </button>                <hr className="my-2 border-gray-100 dark:border-gray-700" />
                <button
                  onClick={() => setShowMenu(false)}
                  className={`
                    w-full
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    ${theme.text.primary}
                    hover:${theme.surfaceHover}
                    transition-colors
                    flex
                    items-center
                    gap-3
                  `}
                >
                <Settings size={14} />
                <span className="inline">
                  Cài đặt widget
                </span>
                </button>
                </div>
              )}
          </div>
        </div>
        {/* Responsive Content Area */}
        <div className={`
          ${responsiveConfig.padding.content}
          ${responsiveConfig.spacing.contentGap}
          flex-1
          overflow-auto
          ${isExpanded ? 'h-full' : 'h-[calc(100%-64px)]'}
          ${theme.surface}
        `}
        style={{
          minHeight: responsiveConfig.minHeight,
          maxHeight: isExpanded ? 'none' : maxHeight,
          aspectRatio: isExpanded ? 'auto' : aspectRatio
        }}>
          {isVisible && children}
        </div>
      </div>

  );
}



export default WidgetWrapper;





