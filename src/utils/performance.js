// Performance Monitoring with Web Vitals
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

// Send metrics to analytics service
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint (only if properly configured)
  const analyticsEndpoint = process.env.REACT_APP_ANALYTICS_ENDPOINT;
  if (
    analyticsEndpoint &&
    analyticsEndpoint !== 'YOUR_ANALYTICS_ENDPOINT_HERE' &&
    !analyticsEndpoint.includes('YOUR_')
  ) {
    fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    }).catch((error) => {
      // Only log errors in development mode
      if (process.env.NODE_ENV === 'development') {
        console.debug('Analytics endpoint error:', error);
      }
    });
  }

  // Log to console in development (only for real metrics, not fallback ones)
  if (
    process.env.NODE_ENV === 'development' &&
    metric.name !== 'PageLoadTime' &&
    metric.value > 0
  ) {
    console.debug('Web Vital:', metric);
  }
}

// Initialize Web Vitals monitoring
function initPerformanceMonitoring() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics); // INP replaces FID in newer web-vitals
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);

  // Additional performance metrics
  if ('performance' in window) {
    // Monitor page load time (only if performance.timing is available and valid)
    window.addEventListener('load', () => {
      if (
        performance.timing &&
        performance.timing.loadEventEnd > 0 &&
        performance.timing.navigationStart > 0
      ) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        // Only send if loadTime is valid (positive and reasonable)
        if (loadTime > 0 && loadTime < 60000) {
          // Less than 60 seconds
          sendToAnalytics({
            name: 'PageLoadTime',
            value: loadTime,
            id: 'page-load',
            delta: loadTime,
            entries: [],
          });
        }
      }
    });

    // Monitor memory usage (if available) - only in development
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memoryInfo = performance.memory;
      if (memoryInfo && memoryInfo.usedJSHeapSize > 0) {
        sendToAnalytics({
          name: 'MemoryUsage',
          value: memoryInfo.usedJSHeapSize / 1024 / 1024, // MB
          id: 'memory-usage',
          delta: memoryInfo.usedJSHeapSize / 1024 / 1024,
          entries: [],
        });
      }
    }
  }
}

export { initPerformanceMonitoring, sendToAnalytics };
