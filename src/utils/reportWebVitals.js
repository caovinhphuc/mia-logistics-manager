const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    try {
      // Try to load web-vitals dynamically
      import('web-vitals')
        .then((webVitalsModule) => {
          const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitalsModule;

          // Check if functions exist before calling them
          if (typeof getCLS === 'function') getCLS(onPerfEntry);
          if (typeof getFID === 'function') getFID(onPerfEntry);
          if (typeof getFCP === 'function') getFCP(onPerfEntry);
          if (typeof getLCP === 'function') getLCP(onPerfEntry);
          if (typeof getTTFB === 'function') getTTFB(onPerfEntry);
        })
        .catch((error) => {
          console.warn('Web Vitals could not be loaded:', error);
        });
    } catch (error) {
      console.warn('Error loading web vitals:', error);
    }
  }
};

export default reportWebVitals;
