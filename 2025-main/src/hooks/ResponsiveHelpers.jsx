// ResponsiveHelpers.jsx
import { useState, useEffect } from 'react';

// Breakpoints để sử dụng trong toàn bộ ứng dụng
export const BREAKPOINTS = {
  // Các kích thước màn hình
  // < 640px = mobile
  mobile: 640,   // < 640px = mobile
  // 640px - 1024px = tablet
  tablet: 1024,  // 640px - 1024px = tablet
  // > 1024px = desktop
  desktop: 1920, // > 1024px = desktop
  // > 1280px = large desktop
  largeDesktop: 2560 // > 1920px = large desktop


};


/**
 * Hook để phát hiện kích thước màn hình hiện tại và trả về chế độ xem tương ứng
 * @returns {Object} { viewMode, isMobile, isTablet, isDesktop, width, height }
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    viewMode: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let viewMode = 'desktop';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width < BREAKPOINTS.mobile) {
        viewMode = 'mobile';
        isMobile = true;
      } else if (width < BREAKPOINTS.tablet) {
        viewMode = 'tablet';
        isTablet = true;
      } else {
        viewMode = 'desktop';
        isDesktop = true;
      }

      setViewport({
        width,
        height,
        viewMode,
        isMobile,
        isTablet,
        isDesktop
      });
    };

    // Initial call
    handleResize();

    // Set up event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

/**
 * Component để hiển thị nội dung dựa trên kích thước màn hình
 */
export const Responsive = ({
  children,
  mobile,
  tablet,
  desktop,
  mobileAndTablet,
  tabletAndDesktop
}) => {
  const { viewMode } = useViewport();

  if (viewMode === 'mobile' && mobile) {
    return mobile;
  }

  if (viewMode === 'tablet' && tablet) {
    return tablet;
  }

  if (viewMode === 'desktop' && desktop) {
    return desktop;
  }

  if ((viewMode === 'mobile' || viewMode === 'tablet') && mobileAndTablet) {
    return mobileAndTablet;
  }

  if ((viewMode === 'tablet' || viewMode === 'desktop') && tabletAndDesktop) {
    return tabletAndDesktop;
  }

  // Mặc định trả về children nếu không có điều kiện nào phù hợp
  if (children) {
    return children;
  }

  return null;
};
