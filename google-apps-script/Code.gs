/**
 * MIA Logistics Manager - Web App Handlers
 * Handle HTTP requests from the React application
 */

/**
 * Handle GET requests to the web app
 */
function doGet(e) {
  const params = e.parameter;
  const functionName = params.function;
  
  if (!functionName) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Function parameter is required'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    let result;
    
    switch (functionName) {
      case 'testFunction':
        result = testFunction();
        break;
        
      case 'calculateDistance':
        if (!params.origin || !params.destination) {
          throw new Error('Origin and destination are required');
        }
        result = calculateDistance(params.origin, params.destination, params);
        break;
        
      case 'geocodeAddress':
        if (!params.address) {
          throw new Error('Address parameter is required');
        }
        result = geocodeAddress(params.address);
        break;
        
      case 'reverseGeocode':
        if (!params.lat || !params.lng) {
          throw new Error('Latitude and longitude are required');
        }
        result = reverseGeocode(parseFloat(params.lat), parseFloat(params.lng));
        break;
        
      case 'validateAddress':
        if (!params.address) {
          throw new Error('Address parameter is required');
        }
        result = validateAddress(params.address);
        break;
        
      default:
        throw new Error('Unknown function: ' + functionName);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('doGet error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests to the web app
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const functionName = data.function;
    
    if (!functionName) {
      throw new Error('Function parameter is required');
    }
    
    let result;
    
    switch (functionName) {
      case 'optimizeRoute':
        if (!data.waypoints) {
          throw new Error('Waypoints are required');
        }
        result = optimizeRoute(data.waypoints, data.options || {});
        break;
        
      case 'getTrafficInfo':
        if (!data.origin || !data.destination) {
          throw new Error('Origin and destination are required');
        }
        result = getTrafficInfo(data.origin, data.destination);
        break;
        
      case 'calculateDeliveryTime':
        if (!data.origin || !data.destination) {
          throw new Error('Origin and destination are required');
        }
        result = calculateDeliveryTime(data.origin, data.destination, data.options || {});
        break;
        
      case 'getDirections':
        if (!data.origin || !data.destination) {
          throw new Error('Origin and destination are required');
        }
        result = getDirections(data.origin, data.destination, data.waypoints || []);
        break;
        
      case 'calculateFuelCost':
        if (data.distance === undefined || data.fuelPrice === undefined) {
          throw new Error('Distance and fuel price are required');
        }
        result = calculateFuelCost(data.distance, data.fuelPrice, data.consumption);
        break;
        
      case 'optimizeMultipleRoutes':
        if (!data.routes) {
          throw new Error('Routes array is required');
        }
        result = optimizeMultipleRoutes(data.routes, data.options || {});
        break;
        
      default:
        throw new Error('Unknown function: ' + functionName);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Set up CORS headers for cross-origin requests
 */
function setCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}