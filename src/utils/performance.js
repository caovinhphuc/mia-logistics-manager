// Performance Monitoring with Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

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

  // Send to custom analytics endpoint
  if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
    fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    }).catch(console.error);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
}

// Initialize Web Vitals monitoring
function initPerformanceMonitoring() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);

  // Additional performance metrics
  if ('performance' in window) {
    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      sendToAnalytics({
        name: 'PageLoadTime',
        value: loadTime,
        id: 'page-load',
        delta: loadTime,
        entries: []
      });
    });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = performance.memory;
      sendToAnalytics({
        name: 'MemoryUsage',
        value: memoryInfo.usedJSHeapSize / 1024 / 1024, // MB
        id: 'memory-usage',
        delta: memoryInfo.usedJSHeapSize / 1024 / 1024,
        entries: []
      });
    }
  }
}

export { initPerformanceMonitoring, sendToAnalytics };