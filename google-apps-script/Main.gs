/**
 * MIA Logistics Manager - Google Apps Script
 * Main functions for distance calculation, route optimization, and address handling
 */

/**
 * Test function to verify Apps Script is working
 */
function testFunction() {
  return {
    success: true,
    message: "MIA Logistics Apps Script is working!",
    timestamp: new Date().toISOString()
  };
}

/**
 * Calculate distance between two addresses using Google Maps Distance Matrix API
 * @param {string} origin - Starting address
 * @param {string} destination - Ending address
 * @param {Object} options - Additional options (mode, units, etc.)
 * @return {Object} Distance calculation result
 */
function calculateDistance(origin, destination, options = {}) {
  try {
    const mode = options.mode || 'DRIVING';
    const units = options.units || 'METRIC';
    const avoidHighways = options.avoidHighways || false;
    const avoidTolls = options.avoidTolls || false;
    
    const response = Maps.newDistanceMatrixService()
      .addOrigin(origin)
      .addDestination(destination)
      .setMode(mode)
      .setUnits(units)
      .setAvoidHighways(avoidHighways)
      .setAvoidTolls(avoidTolls)
      .getDistanceMatrix();
    
    if (response.status !== 'OK') {
      throw new Error('Distance Matrix API error: ' + response.status);
    }
    
    const element = response.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      throw new Error('Route calculation error: ' + element.status);
    }
    
    return {
      success: true,
      distance: {
        text: element.distance.text,
        value: element.distance.value // meters
      },
      duration: {
        text: element.duration.text,
        value: element.duration.value // seconds
      },
      origin: origin,
      destination: destination,
      mode: mode
    };
    
  } catch (error) {
    Logger.log('calculateDistance error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Optimize route for multiple waypoints
 * @param {Array} waypoints - Array of addresses to visit
 * @param {Object} options - Optimization options
 * @return {Object} Optimized route result
 */
function optimizeRoute(waypoints, options = {}) {
  try {
    if (!waypoints || waypoints.length < 2) {
      throw new Error('At least 2 waypoints are required');
    }
    
    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const intermediateWaypoints = waypoints.slice(1, -1);
    
    const directionsService = Maps.newDirectionFinder();
    directionsService.setOrigin(origin);
    directionsService.setDestination(destination);
    
    // Add intermediate waypoints
    if (intermediateWaypoints.length > 0) {
      intermediateWaypoints.forEach(waypoint => {
        directionsService.addWaypoint(waypoint);
      });
    }
    
    directionsService.setOptimizeWaypoints(options.optimize !== false);
    directionsService.setMode(options.mode || 'DRIVING');
    
    if (options.avoidHighways) {
      directionsService.setAvoidHighways(true);
    }
    
    if (options.avoidTolls) {
      directionsService.setAvoidTolls(true);
    }
    
    const directions = directionsService.getDirections();
    
    if (directions.status !== 'OK') {
      throw new Error('Directions API error: ' + directions.status);
    }
    
    const route = directions.routes[0];
    const legs = route.legs;
    
    let totalDistance = 0;
    let totalDuration = 0;
    const optimizedWaypoints = [];
    
    // Calculate totals and extract waypoint order
    legs.forEach((leg, index) => {
      totalDistance += leg.distance.value;
      totalDuration += leg.duration.value;
      
      if (index === 0) {
        optimizedWaypoints.push({
          address: leg.start_address,
          location: leg.start_location
        });
      }
      
      optimizedWaypoints.push({
        address: leg.end_address,
        location: leg.end_location
      });
    });
    
    return {
      success: true,
      totalDistance: {
        text: (totalDistance / 1000).toFixed(1) + ' km',
        value: totalDistance
      },
      totalDuration: {
        text: Math.round(totalDuration / 60) + ' phút',
        value: totalDuration
      },
      optimizedWaypoints: optimizedWaypoints,
      waypointOrder: route.waypoint_order || [],
      overview_polyline: route.overview_polyline
    };
    
  } catch (error) {
    Logger.log('optimizeRoute error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Geocode an address to get coordinates
 * @param {string} address - Address to geocode
 * @return {Object} Geocoding result
 */
function geocodeAddress(address) {
  try {
    const geocoder = Maps.newGeocoder();
    const response = geocoder.geocode(address);
    
    if (response.status !== 'OK' || !response.results || response.results.length === 0) {
      throw new Error('Geocoding failed: ' + (response.status || 'No results'));
    }
    
    const result = response.results[0];
    
    return {
      success: true,
      address: result.formatted_address,
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      },
      placeId: result.place_id,
      types: result.types,
      addressComponents: result.address_components
    };
    
  } catch (error) {
    Logger.log('geocodeAddress error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Reverse geocode coordinates to get address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @return {Object} Reverse geocoding result
 */
function reverseGeocode(lat, lng) {
  try {
    const geocoder = Maps.newGeocoder();
    const response = geocoder.reverseGeocode(lat, lng);
    
    if (response.status !== 'OK' || !response.results || response.results.length === 0) {
      throw new Error('Reverse geocoding failed: ' + (response.status || 'No results'));
    }
    
    const result = response.results[0];
    
    return {
      success: true,
      address: result.formatted_address,
      location: {
        lat: lat,
        lng: lng
      },
      placeId: result.place_id,
      types: result.types,
      addressComponents: result.address_components
    };
    
  } catch (error) {
    Logger.log('reverseGeocode error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get traffic information for a route
 * @param {string} origin - Starting address
 * @param {string} destination - Ending address
 * @return {Object} Traffic information
 */
function getTrafficInfo(origin, destination) {
  try {
    const now = new Date();
    
    // Get current traffic conditions
    const currentResponse = Maps.newDistanceMatrixService()
      .addOrigin(origin)
      .addDestination(destination)
      .setMode('DRIVING')
      .setUnits('METRIC')
      .setDepartureTime(now)
      .setTrafficModel('BEST_GUESS')
      .getDistanceMatrix();
    
    if (currentResponse.status !== 'OK') {
      throw new Error('Traffic API error: ' + currentResponse.status);
    }
    
    const currentElement = currentResponse.rows[0].elements[0];
    
    if (currentElement.status !== 'OK') {
      throw new Error('Traffic calculation error: ' + currentElement.status);
    }
    
    // Get optimistic traffic conditions
    const optimisticResponse = Maps.newDistanceMatrixService()
      .addOrigin(origin)
      .addDestination(destination)
      .setMode('DRIVING')
      .setUnits('METRIC')
      .setDepartureTime(now)
      .setTrafficModel('OPTIMISTIC')
      .getDistanceMatrix();
    
    const optimisticElement = optimisticResponse.rows[0].elements[0];
    
    return {
      success: true,
      current: {
        duration: currentElement.duration,
        durationInTraffic: currentElement.duration_in_traffic
      },
      optimistic: {
        duration: optimisticElement.duration,
        durationInTraffic: optimisticElement.duration_in_traffic
      },
      trafficDelay: {
        value: (currentElement.duration_in_traffic?.value || currentElement.duration.value) - optimisticElement.duration.value,
        text: Math.round(((currentElement.duration_in_traffic?.value || currentElement.duration.value) - optimisticElement.duration.value) / 60) + ' phút'
      },
      timestamp: now.toISOString()
    };
    
  } catch (error) {
    Logger.log('getTrafficInfo error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Calculate estimated delivery time
 * @param {string} origin - Starting address
 * @param {string} destination - Ending address
 * @param {Object} options - Calculation options
 * @return {Object} Delivery time estimation
 */
function calculateDeliveryTime(origin, destination, options = {}) {
  try {
    const departureTime = options.departureTime ? new Date(options.departureTime) : new Date();
    const mode = options.mode || 'DRIVING';
    const trafficModel = options.trafficModel || 'BEST_GUESS';
    
    const response = Maps.newDistanceMatrixService()
      .addOrigin(origin)
      .addDestination(destination)
      .setMode(mode)
      .setUnits('METRIC')
      .setDepartureTime(departureTime)
      .setTrafficModel(trafficModel)
      .getDistanceMatrix();
    
    if (response.status !== 'OK') {
      throw new Error('Delivery time API error: ' + response.status);
    }
    
    const element = response.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      throw new Error('Delivery time calculation error: ' + element.status);
    }
    
    const travelTime = element.duration_in_traffic || element.duration;
    const estimatedArrival = new Date(departureTime.getTime() + (travelTime.value * 1000));
    
    // Add buffer time for loading/unloading (15 minutes default)
    const bufferTime = options.bufferTime || 15 * 60; // seconds
    const finalArrival = new Date(estimatedArrival.getTime() + (bufferTime * 1000));
    
    return {
      success: true,
      departureTime: departureTime.toISOString(),
      estimatedArrival: estimatedArrival.toISOString(),
      finalEstimatedArrival: finalArrival.toISOString(),
      travelTime: travelTime,
      distance: element.distance,
      bufferTime: {
        value: bufferTime,
        text: Math.round(bufferTime / 60) + ' phút'
      }
    };
    
  } catch (error) {
    Logger.log('calculateDeliveryTime error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Validate Vietnamese address format
 * @param {string} address - Address to validate
 * @return {Object} Validation result
 */
function validateAddress(address) {
  try {
    if (!address || address.trim().length === 0) {
      return {
        success: false,
        error: 'Address is required'
      };
    }
    
    // Try to geocode the address
    const geocodeResult = geocodeAddress(address);
    
    if (!geocodeResult.success) {
      return {
        success: false,
        error: 'Invalid address: ' + geocodeResult.error,
        suggestions: []
      };
    }
    
    // Check if it's in Vietnam
    const components = geocodeResult.addressComponents;
    const isInVietnam = components.some(component => 
      component.types.includes('country') && 
      (component.short_name === 'VN' || component.long_name === 'Vietnam')
    );
    
    return {
      success: true,
      isValid: true,
      isInVietnam: isInVietnam,
      formattedAddress: geocodeResult.address,
      location: geocodeResult.location,
      addressComponents: components
    };
    
  } catch (error) {
    Logger.log('validateAddress error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get detailed directions between two points
 * @param {string} origin - Starting address
 * @param {string} destination - Ending address
 * @param {Array} waypoints - Optional waypoints
 * @return {Object} Detailed directions
 */
function getDirections(origin, destination, waypoints = []) {
  try {
    const directionsService = Maps.newDirectionFinder();
    directionsService.setOrigin(origin);
    directionsService.setDestination(destination);
    directionsService.setMode('DRIVING');
    directionsService.setUnits('METRIC');
    
    // Add waypoints if provided
    waypoints.forEach(waypoint => {
      directionsService.addWaypoint(waypoint);
    });
    
    const directions = directionsService.getDirections();
    
    if (directions.status !== 'OK') {
      throw new Error('Directions API error: ' + directions.status);
    }
    
    const route = directions.routes[0];
    
    return {
      success: true,
      route: {
        summary: route.summary,
        legs: route.legs.map(leg => ({
          distance: leg.distance,
          duration: leg.duration,
          startAddress: leg.start_address,
          endAddress: leg.end_address,
          startLocation: leg.start_location,
          endLocation: leg.end_location,
          steps: leg.steps.map(step => ({
            distance: step.distance,
            duration: step.duration,
            instructions: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
            maneuver: step.maneuver
          }))
        })),
        overviewPolyline: route.overview_polyline
      }
    };
    
  } catch (error) {
    Logger.log('getDirections error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Calculate fuel cost for a trip
 * @param {number} distance - Distance in kilometers
 * @param {number} fuelPrice - Fuel price per liter
 * @param {number} consumption - Fuel consumption (liters per 100km)
 * @return {Object} Fuel cost calculation
 */
function calculateFuelCost(distance, fuelPrice, consumption = 8) {
  try {
    if (isNaN(distance) || isNaN(fuelPrice) || isNaN(consumption)) {
      throw new Error('All parameters must be numbers');
    }
    
    const distanceKm = distance / 1000; // Convert meters to km if needed
    const fuelNeeded = (distanceKm * consumption) / 100;
    const totalCost = fuelNeeded * fuelPrice;
    
    return {
      success: true,
      distance: {
        km: distanceKm,
        meters: distance
      },
      fuelConsumption: {
        litersPerKm: consumption / 100,
        totalLiters: fuelNeeded
      },
      cost: {
        perLiter: fuelPrice,
        total: totalCost,
        currency: 'VND'
      }
    };
    
  } catch (error) {
    Logger.log('calculateFuelCost error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Optimize multiple routes for multiple vehicles
 * @param {Array} routes - Array of route objects
 * @param {Object} options - Optimization options
 * @return {Object} Multiple routes optimization result
 */
function optimizeMultipleRoutes(routes, options = {}) {
  try {
    if (!routes || !Array.isArray(routes) || routes.length === 0) {
      throw new Error('Routes array is required');
    }
    
    const optimizedRoutes = [];
    let totalDistance = 0;
    let totalDuration = 0;
    
    routes.forEach((route, index) => {
      if (!route.waypoints || route.waypoints.length < 2) {
        optimizedRoutes.push({
          routeIndex: index,
          success: false,
          error: 'Route must have at least 2 waypoints'
        });
        return;
      }
      
      const routeResult = optimizeRoute(route.waypoints, {
        optimize: true,
        mode: route.mode || 'DRIVING'
      });
      
      if (routeResult.success) {
        totalDistance += routeResult.totalDistance.value;
        totalDuration += routeResult.totalDuration.value;
      }
      
      optimizedRoutes.push({
        routeIndex: index,
        vehicleId: route.vehicleId,
        driverId: route.driverId,
        ...routeResult
      });
    });
    
    return {
      success: true,
      totalRoutes: routes.length,
      optimizedRoutes: optimizedRoutes,
      summary: {
        totalDistance: {
          text: (totalDistance / 1000).toFixed(1) + ' km',
          value: totalDistance
        },
        totalDuration: {
          text: Math.round(totalDuration / 3600) + ' giờ ' + Math.round((totalDuration % 3600) / 60) + ' phút',
          value: totalDuration
        }
      }
    };
    
  } catch (error) {
    Logger.log('optimizeMultipleRoutes error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}