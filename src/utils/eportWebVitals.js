//Performance monitoring utilities for MIA Logistics Manager

export const getCLS = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS }) => {
      getCLS(onPerfEntry);
    });
  }
};

export const getFID = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getFID }) => {
      getFID(onPerfEntry);
    });
  }
};

export const getFCP = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getFCP }) => {
      getFCP(onPerfEntry);
    });
  }
};

export const getLCP = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getLCP }) => {
      getLCP(onPerfEntry);
    });
  }
};

export const getTTFB = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getTTFB }) => {
      getTTFB(onPerfEntry);
    });
  }
};
