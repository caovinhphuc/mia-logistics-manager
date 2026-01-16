// Application Constants
export const APP_NAME = 'MIA.vn Logistics';
export const APP_VERSION = '1.0.0';

// Volumetric weight factors
export const DIM_FACTOR_ROAD = 333;
export const DIM_FACTOR_AIR = 167;

// Default rates
export const DEFAULT_RATE_PER_KM = 500;
export const DEFAULT_RATE_PER_M3 = 800000;
export const DEFAULT_RATE_PER_KG = 15000;

// Limits
export const MAX_PACKAGE_WEIGHT = 500; // kg
export const MAX_PACKAGE_VOLUME = 5; // m³
export const MAX_ROUTE_STOPS = 20;

export const extractLocationCode = (address: string): string | null => {
  const match = address.match(/^[A-Z]{2}-\d+$/);
  return match ? match[0] : null;
};

export const getFallbackDistance = (origin: string, destination: string): number => {
  const originLocation = extractLocationCode(origin);
  const destinationLocation = extractLocationCode(destination);

  if (!originLocation || !destinationLocation) {
    return 0;
  }

  return Math.max(0, Math.floor(Math.random() * 1000));
};
