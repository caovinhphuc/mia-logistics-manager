# Google Apps Script Setup Guide

Hướng dẫn chi tiết cấu hình Google Apps Script cho tính năng tính toán khoảng cách.

---

## 📋 Tổng quan

Hệ thống sử dụng Google Apps Script để:

- Tính khoảng cách thực tế giữa các địa chỉ
- Ước tính thời gian di chuyển
- Xử lý địa chỉ dài và ký tự đặc biệt Tiếng Việt

---

## 🚀 Setup Steps

### Step 1: Tạo Google Apps Script Project

1. Truy cập [Google Apps Script](https://script.google.com/)
2. Click **New Project**
3. Đặt tên project: `MIA Distance Calculator`

### Step 2: Copy Script Code

Copy code từ file `google-apps-script/distance-calculator.gs`:

```javascript
/**
 * MIA Logistics Distance Calculator
 * Google Apps Script để tính khoảng cách giữa 2 địa chỉ
 */

function doGet(e) {
  const origin = e.parameter.origin;
  const destination = e.parameter.destination;

  if (!origin || !destination) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: 'Missing origin or destination',
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Xử lý địa chỉ dài
    const processedOrigin = processAddress(origin);
    const processedDestination = processAddress(destination);

    // Tính khoảng cách bằng Google Maps
    const result = calculateDistance(processedOrigin, processedDestination);

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Xử lý địa chỉ dài
 */
function processAddress(address) {
  if (!address || address.length <= 100) {
    return address;
  }

  let processed = address;

  // Rút gọn các thành phố
  const cityMappings = {
    'Thành phố Hồ Chí Minh': 'HCM',
    'Hồ Chí Minh': 'HCM',
    'Thành phố Hà Nội': 'Hà Nội',
    'Thành phố Đà Nẵng': 'Đà Nẵng',
    'Thành phố Cần Thơ': 'Cần Thơ',
  };

  for (const [full, short] of Object.entries(cityMappings)) {
    processed = processed.replace(new RegExp(full, 'gi'), short);
  }

  // Rút gọn các từ khóa
  const replacements = {
    Đường: 'Đ',
    Phường: 'P',
    Quận: 'Q',
    'Thị xã': 'TX',
    'Thị trấn': 'TT',
    Xã: 'X',
    Huyện: 'H',
  };

  for (const [full, short] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(full + '\\s+', 'gi'), short + ' ');
  }

  // Loại bỏ ký tự đặc biệt không cần thiết
  processed = processed.replace(/[,;]/g, ' ');

  // Loại bỏ khoảng trắng thừa
  processed = processed.replace(/\s+/g, ' ').trim();

  return processed;
}

/**
 * Tính khoảng cách sử dụng Google Maps Distance Matrix API
 */
function calculateDistance(origin, destination) {
  try {
    const directions = Maps.newDirectionFinder()
      .setOrigin(origin)
      .setDestination(destination)
      .setMode(Maps.DirectionFinder.Mode.DRIVING)
      .getDirections();

    if (!directions || !directions.routes || directions.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = directions.routes[0];
    const leg = route.legs[0];

    // Distance in km
    const distance = leg.distance.value / 1000;

    // Duration in minutes
    const duration = leg.duration.value / 60;

    return {
      success: true,
      distance: Math.round(distance * 100) / 100,
      duration: Math.round(duration),
      method: 'google_maps',
      origin: leg.start_address,
      destination: leg.end_address,
    };
  } catch (error) {
    // Fallback: Haversine formula
    return calculateDistanceHaversine(origin, destination);
  }
}

/**
 * Fallback: Tính khoảng cách bằng công thức Haversine
 */
function calculateDistanceHaversine(origin, destination) {
  try {
    const originCoords = getCoordinates(origin);
    const destCoords = getCoordinates(destination);

    const R = 6371; // Radius of Earth in km
    const dLat = toRad(destCoords.lat - originCoords.lat);
    const dLon = toRad(destCoords.lng - originCoords.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(originCoords.lat)) *
        Math.cos(toRad(destCoords.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Estimate duration (assuming 50 km/h average)
    const duration = (distance / 50) * 60;

    return {
      success: true,
      distance: Math.round(distance * 100) / 100,
      duration: Math.round(duration),
      method: 'haversine',
      note: 'Approximate straight-line distance',
    };
  } catch (error) {
    throw new Error('Failed to calculate distance: ' + error.toString());
  }
}

/**
 * Lấy tọa độ từ địa chỉ
 */
function getCoordinates(address) {
  const geocoder = Maps.newGeocoder().geocode(address);

  if (!geocoder || geocoder.status !== 'OK' || !geocoder.results[0]) {
    throw new Error('Cannot geocode address: ' + address);
  }

  const location = geocoder.results[0].geometry.location;
  return {
    lat: location.lat,
    lng: location.lng,
  };
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}
```

### Step 3: Save Script

1. Click **💾 Save** (hoặc `Ctrl+S`)
2. Đặt tên: `MIA Distance Calculator`

### Step 4: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click ⚙️ (gear icon) → Select type: **Web app**
3. Cấu hình:
   - **Description**: `MIA Distance Calculator API`
   - **Execute as**: **Me** (your account)
   - **Who has access**: **Anyone** (hoặc **Anyone with the link**)
4. Click **Deploy**
5. **Authorize**: Click "Authorize access" và cho phép quyền truy cập
6. **Copy URL**: Copy deployment URL (dạng: `https://script.google.com/macros/s/AKfycby.../exec`)

### Step 5: Configure Environment

Cập nhật file `.env`:

```bash
# Google Apps Script
REACT_APP_GOOGLE_APPS_SCRIPT_ID=AKfycby...
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycby.../exec
```

---

## 🧪 Testing

### Test với cURL

```bash
# Test basic
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?origin=Hanoi&destination=Ho%20Chi%20Minh%20City"

# Test với địa chỉ dài
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?origin=lô2-5,%20Đường%20CN1,%20Phường%20Tây%20Thạnh,%20Quận%20Tân%20Phú,%20Thành%20phố%20Hồ%20Chí%20Minh&destination=123%20Đường%20Nguyễn%20Huệ,%20Quận%201,%20HCM"
```

### Expected Response

```json
{
  "success": true,
  "distance": 1479.24,
  "duration": 1775,
  "method": "google_maps",
  "origin": "Hanoi, Vietnam",
  "destination": "Ho Chi Minh City, Vietnam"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Missing origin or destination"
}
```

---

## 🔧 Troubleshooting

### Issue 1: "Script not authorized"

**Solution:**

1. Go to script editor
2. Run any function manually
3. Click "Review Permissions"
4. Allow required permissions

### Issue 2: "Exceeded quota"

**Solution:**

- Google Apps Script có giới hạn API calls
- Free account: 20,000 calls/day
- Check quota: [Google Cloud Console](https://console.cloud.google.com)

### Issue 3: "No route found"

**Reasons:**

- Địa chỉ không hợp lệ
- Không có đường đi giữa 2 điểm
- API key không có quyền

**Solution:**

- Verify địa chỉ
- Check API key permissions
- Enable required APIs in Google Cloud Console

### Issue 4: "CORS Error"

**Solution:**

- Đảm bảo deploy type là "Web app"
- "Who has access" phải là "Anyone" hoặc "Anyone with the link"

---

## 📊 Performance

### Optimization Tips

1. **Cache Results**: Cache kết quả đã tính
2. **Batch Requests**: Gom nhiều requests nếu có thể
3. **Retry Logic**: Implement retry cho failed requests
4. **Fallback**: Sử dụng Haversine khi Google Maps fail

### API Limits

| Tier     | Daily Calls | Cost                  |
| -------- | ----------- | --------------------- |
| Free     | 20,000      | $0                    |
| Standard | 100,000     | $0.005/call after 20k |
| Premium  | Unlimited   | Contact sales         |

---

## 🔐 Security

### Best Practices

1. **Don't expose Script ID** publicly
2. **Use environment variables** for configuration
3. **Monitor usage** via Google Cloud Console
4. **Rotate credentials** regularly
5. **Limit access** if possible

### API Key Management

```bash
# Development
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/.../exec

# Production (use different deployment)
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/.../exec-prod
```

---

## 📚 Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Maps Service Reference](https://developers.google.com/apps-script/reference/maps)
- [Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)

---

**Last Updated**: November 12, 2025
**Version**: 2.1.1
