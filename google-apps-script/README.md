# MIA Logistics Manager - Google Apps Script

## 📁 Files Overview

- **Main.gs**: Core functions for distance calculation, route optimization, geocoding
- **Code.gs**: Web App handlers for HTTP requests from React app
- **appsscript.json**: Project manifest and configuration

## 🚀 Setup Instructions

### 1. Create New Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Rename to "MIA Logistics Manager"

### 2. Add Code Files

1. Delete default `Code.gs`
2. Create new files and copy content from this folder:
   - `Main.gs`
   - `Code.gs`
   - `appsscript.json` (replace existing)

### 3. Enable Services

1. Click on "Services" (+ icon)
2. Add "Google Maps Service"
3. Set identifier as "Maps"

### 4. Deploy Web App

1. Click "Deploy" > "New Deployment"
2. Type: Web App
3. Description: "MIA Logistics API"
4. Execute as: Me
5. Who has access: Anyone
6. Click "Deploy"
7. Copy the Web App URL

### 5. Configure Permissions

1. Run any function to trigger authorization
2. Review and accept all permissions
3. Test with `testFunction()`

## 🔧 Available Functions

### Distance & Routes

- `calculateDistance(origin, destination, options)`
- `optimizeRoute(waypoints, options)`
- `optimizeMultipleRoutes(routes, options)`
- `getDirections(origin, destination, waypoints)`

### Geocoding

- `geocodeAddress(address)`
- `reverseGeocode(lat, lng)`
- `validateAddress(address)`

### Traffic & Time

- `getTrafficInfo(origin, destination)`
- `calculateDeliveryTime(origin, destination, options)`

### Utilities

- `calculateFuelCost(distance, fuelPrice, consumption)`
- `testFunction()`

## 📞 API Usage

### GET Requests

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?function=calculateDistance&origin=Hanoi&destination=HoChiMinh
```

### POST Requests

```javascript
fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
  method: 'POST',
  body: JSON.stringify({
    function: 'optimizeRoute',
    waypoints: ['Hanoi', 'Danang', 'HoChiMinh'],
    options: { optimize: true }
  })
})
```

## 🔑 Required Permissions

- Google Maps Service
- External URL requests
- Script execution

## 📝 Notes

- All functions return JSON responses
- Error handling included for all functions
- Supports Vietnamese addresses
- Optimized for Vietnam logistics use cases
- CORS enabled for web app requests

## 🐛 Troubleshooting

### Common Issues

1. **Authorization Required**
   - Run functions manually first
   - Accept all permission requests

2. **Maps API Errors**
   - Check if Maps service is enabled
   - Verify API quotas in Google Cloud Console

3. **Web App Access Denied**
   - Ensure deployment is set to "Anyone"
   - Check sharing permissions

### Testing

Use the `testFunction()` to verify setup:

```javascript
// Should return:
{
  "success": true,
  "message": "MIA Logistics Apps Script is working!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```
