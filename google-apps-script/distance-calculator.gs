/**
 * Google Apps Script để tính khoảng cách thực tế
 * Sử dụng Google Maps Services có sẵn trong Google Apps Script (không cần API key)
 *
 * Deploy: Web App
 * Execute as: Me
 * Who has access: Anyone
 *
 * URL format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */

/**
 * Main function để xử lý GET requests từ frontend
 * @param {Object} e - Event object từ Apps Script Web App
 * @returns {Object} - Kết quả tính khoảng cách
 */
function doGet(e) {
  try {
    console.log("🔍 Starting distance calculation...");
    console.log("📋 Request parameters:", e);

    // Kiểm tra và lấy tham số từ request
    if (!e || !e.parameter) {
      console.error("❌ No parameters provided");
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "No parameters provided. Use ?origin=...&destination=...",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const origin = e.parameter.origin;
    const destination = e.parameter.destination;

    const shouldNotify = shouldSendNotification(e && e.parameter);

    console.log(`📍 Origin: ${origin}`);
    console.log(`📍 Destination: ${destination}`);

    if (!origin || !destination) {
      console.error("❌ Missing origin or destination parameter");
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Missing origin or destination parameter. Use ?origin=...&destination=...",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    console.log(`🔍 Calculating real distance from ${origin} to ${destination}`);

    // Sử dụng Google Maps Services có sẵn trong Google Apps Script
    const distanceResult = calculateDistanceWithGoogleMaps(origin, destination);

    if (distanceResult.success) {
      console.log(`✅ Real distance calculated: ${distanceResult.distance.toFixed(2)} km`);
      const responseBody = {
        success: true,
        distance: distanceResult.distance,
        duration: distanceResult.duration,
        method: "google_maps_services",
        origin: origin,
        destination: destination,
        notified: shouldNotify,
      };

      if (shouldNotify) {
        notifyTelegramSuccess(origin, destination, distanceResult);
      }

      return ContentService.createTextOutput(JSON.stringify(responseBody)).setMimeType(
        ContentService.MimeType.JSON
      );
    } else {
      console.error("❌ Could not calculate distance");
      const errorBody = {
        success: false,
        error: distanceResult.error || "Could not calculate distance for these addresses.",
        origin: origin,
        destination: destination,
        notified: shouldNotify,
      };

      if (shouldNotify) {
        notifyTelegramFailure(origin, destination, errorBody.error);
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: distanceResult.error || "Could not calculate distance for these addresses.",
          origin: origin,
          destination: destination,
          notified: shouldNotify,
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("❌ Error:", error.toString());
    const errorMessage = error.toString();

    if (shouldSendNotification(e && e.parameter)) {
      notifyTelegramFailure(
        (e && e.parameter && e.parameter.origin) || "Unknown",
        (e && e.parameter && e.parameter.destination) || "Unknown",
        errorMessage
      );
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: errorMessage,
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Main function để xử lý POST requests từ frontend
 * @param {Object} e - Event object từ Apps Script Web App
 * @returns {Object} - Kết quả
 */
function doPost(e) {
  try {
    const jsonData = JSON.parse(e.postData.contents);
    const functionName = jsonData.function;
    const shouldNotify = shouldSendNotification(jsonData);

    // Route to appropriate function
    switch (functionName) {
      case "calculateDistance":
        const result = calculateDistanceWithGoogleMaps(jsonData.origin, jsonData.destination);
        if (result.success) {
          if (shouldNotify) {
            notifyTelegramSuccess(jsonData.origin, jsonData.destination, result);
          }
          return ContentService.createTextOutput(
            JSON.stringify({
              success: true,
              distance: result.distance,
              duration: result.duration,
              method: "google_maps_services",
              origin: jsonData.origin,
              destination: jsonData.destination,
              notified: shouldNotify,
            })
          ).setMimeType(ContentService.MimeType.JSON);
        } else {
          if (shouldNotify) {
            notifyTelegramFailure(jsonData.origin, jsonData.destination, result.error);
          }
          return ContentService.createTextOutput(
            JSON.stringify({
              success: false,
              error: result.error || "Could not calculate distance",
              origin: jsonData.origin,
              destination: jsonData.destination,
              notified: shouldNotify,
            })
          ).setMimeType(ContentService.MimeType.JSON);
        }

      default:
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Invalid function name: " + functionName,
            notified: shouldNotify,
          })
        ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("❌ Error in doPost:", error.toString());
    if (shouldSendNotification(e && e.parameter)) {
      notifyTelegramFailure("Unknown", "Unknown", error.toString());
    }
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        notified: shouldSendNotification(e && e.parameter),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Tính khoảng cách sử dụng Google Maps Services có sẵn trong Google Apps Script
 * @param {string} origin - Điểm xuất phát
 * @param {string} destination - Điểm đến
 * @returns {Object} - Kết quả khoảng cách và thời gian
 */
function calculateDistanceWithGoogleMaps(origin, destination) {
  try {
    console.log(`🗺️ Using Google Maps Services...`);

    // Lấy tọa độ từ địa chỉ
    const originCoords = getCoordinatesFromAddress(origin);
    const destCoords = getCoordinatesFromAddress(destination);

    if (!originCoords || !destCoords) {
      console.error("❌ Could not get coordinates from addresses");
      return {
        success: false,
        error: "Could not get coordinates from addresses",
      };
    }

    console.log(`📍 Origin coordinates: ${originCoords.lat}, ${originCoords.lng}`);
    console.log(`📍 Destination coordinates: ${destCoords.lat}, ${destCoords.lng}`);

    // Thử sử dụng DirectionFinder để tính khoảng cách đường bộ chính xác hơn
    try {
      const directions = Maps.newDirectionFinder()
        .setOrigin(origin)
        .setDestination(destination)
        .setMode(Maps.DirectionFinder.Mode.DRIVING)
        .getDirections();

      if (directions && directions.routes && directions.routes.length > 0) {
        const route = directions.routes[0];
        const leg = route.legs[0];
        const distanceKm = leg.distance.value / 1000; // Convert meters to km
        const durationMinutes = Math.round(leg.duration.value / 60); // Convert seconds to minutes

        console.log(
          `✅ Distance calculated: ${distanceKm.toFixed(2)} km, ${durationMinutes} minutes`
        );

        return {
          success: true,
          distance: distanceKm,
          duration: durationMinutes,
        };
      }
    } catch (dirError) {
      console.warn("⚠️ DirectionFinder failed, using Haversine:", dirError.toString());
      // Fallback to Haversine calculation
    }

    // Fallback: Tính khoảng cách bằng công thức Haversine
    const distanceKm = calculateHaversineDistance(originCoords, destCoords);

    // Ước tính thời gian (trung bình 30km/h trong thành phố)
    const estimatedDurationMinutes = Math.round(distanceKm * 2);

    console.log(
      `✅ Distance calculated: ${distanceKm.toFixed(2)} km, ${estimatedDurationMinutes} minutes`
    );

    return {
      success: true,
      distance: distanceKm,
      duration: estimatedDurationMinutes,
    };
  } catch (error) {
    console.error(`❌ Google Maps Services error:`, error.toString());
    return {
      success: false,
      error: error.toString(),
    };
  }
}

/**
 * Lấy tọa độ từ địa chỉ sử dụng Google Maps Services
 * @param {string} address - Địa chỉ cần geocode
 * @returns {Object|null} - Object chứa lat và lng, hoặc null nếu không tìm thấy
 */
function getCoordinatesFromAddress(address) {
  try {
    console.log(`🗺️ Getting coordinates for: ${address}`);

    // Sử dụng Google Maps Geocoding service có sẵn
    const geocoder = Maps.newGeocoder();
    const result = geocoder.geocode(address);

    if (result && result.results && result.results.length > 0) {
      const location = result.results[0].geometry.location;
      console.log(`✅ Coordinates: ${location.lat}, ${location.lng}`);
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.error(`❌ No coordinates found for: ${address}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Geocoding error for ${address}:`, error.toString());
    return null;
  }
}

/**
 * Tính khoảng cách giữa 2 điểm bằng công thức Haversine (khoảng cách đường chim bay)
 * @param {Object} point1 - Điểm 1 với lat và lng
 * @param {Object} point2 - Điểm 2 với lat và lng
 * @returns {number} - Khoảng cách tính bằng km (đã điều chỉnh hệ số đường bộ)
 */
function calculateHaversineDistance(point1, point2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Thêm hệ số điều chỉnh cho đường bộ (khoảng 1.3x)
  const roadDistance = distance * 1.3;

  console.log(`📏 Raw distance: ${distance.toFixed(2)} km`);
  console.log(`🛣️ Road distance: ${roadDistance.toFixed(2)} km`);

  return roadDistance;
}

/**
 * Kiểm tra có cần gửi thông báo Telegram không
 * @param {Object} params
 * @returns {boolean}
 */
function shouldSendNotification(params) {
  if (!params) {
    return false;
  }
  const value =
    params.notify ||
    params.telegram ||
    params.tg ||
    params.alert ||
    (typeof params === "object" && params.notify !== undefined && params.notify);
  if (value === undefined || value === null) {
    return false;
  }
  const normalized = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "y", "on", "notify"].indexOf(normalized) !== -1;
}

/**
 * Lấy thông tin cấu hình Telegram từ Script Properties
 * @returns {{token: string|null, chatId: string|null}}
 */
function getTelegramConfig() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = props.getProperty("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    console.warn(
      "⚠️ Telegram config missing. Set TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID trong Script Properties."
    );
  }
  return { token: token || null, chatId: chatId || null };
}

/**
 * Gửi thông báo thành công tới Telegram
 * @param {string} origin
 * @param {string} destination
 * @param {{distance:number, duration:number}} result
 */
function notifyTelegramSuccess(origin, destination, result) {
  const message = [
    "🟢 Kiểm tra Google Apps Script thành công",
    `• Origin: ${origin}`,
    `• Destination: ${destination}`,
    `• Distance: ${result.distance.toFixed(2)} km`,
    `• Duration: ${result.duration} phút`,
    `• Timestamp: ${new Date().toISOString()}`,
  ].join("\n");
  sendTelegramNotification(message);
}

/**
 * Gửi thông báo thất bại tới Telegram
 * @param {string} origin
 * @param {string} destination
 * @param {string} errorMessage
 */
function notifyTelegramFailure(origin, destination, errorMessage) {
  const message = [
    "🔴 Lỗi Google Apps Script distance test",
    `• Origin: ${origin}`,
    `• Destination: ${destination}`,
    `• Error: ${errorMessage}`,
    `• Timestamp: ${new Date().toISOString()}`,
  ].join("\n");
  sendTelegramNotification(message);
}

/**
 * Hàm gửi thông báo tới Telegram
 * @param {string} message
 */
function sendTelegramNotification(message) {
  const { token, chatId } = getTelegramConfig();
  if (!token || !chatId) {
    console.warn("⚠️ Không thể gửi Telegram: thiếu token hoặc chatId");
    return;
  }
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
      method: "post",
      contentType: "application/json",
      muteHttpExceptions: true,
      payload: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    };
    const response = UrlFetchApp.fetch(url, payload);
    const data = JSON.parse(response.getContentText());
    if (!data.ok) {
      console.error("❌ Telegram API error:", data);
    } else {
      console.log("✅ Telegram notification sent");
    }
  } catch (err) {
    console.error("❌ Failed to send Telegram notification:", err);
  }
}

/**
 * Thiết lập Script Properties cho Telegram.
 * Chạy hàm này trong Apps Script Editor sau khi thay thế giá trị placeholder.
 */
function configureTelegramProperties() {
  const TELEGRAM_BOT_TOKEN = "PASTE_YOUR_TELEGRAM_BOT_TOKEN_HERE";
  const TELEGRAM_CHAT_ID = "PASTE_YOUR_TELEGRAM_CHAT_ID_HERE";

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error(
      "Vui lòng thay giá trị TELEGRAM_BOT_TOKEN/CHAT_ID trước khi chạy configureTelegramProperties()."
    );
  }

  PropertiesService.getScriptProperties().setProperties(
    {
      TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: TELEGRAM_CHAT_ID,
    },
    true
  );

  console.log("✅ Script Properties đã được cập nhật.");
  console.log(
    JSON.stringify(
      {
        TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN.slice(0, 6) + "...",
        TELEGRAM_CHAT_ID: String(TELEGRAM_CHAT_ID).slice(0, 4) + "...",
      },
      null,
      2
    )
  );
}

/**
 * Test function - Chạy trong Apps Script Editor để test
 */
function testDistanceCalculation() {
  const origin = "lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú, TP. Hồ Chí Minh";
  const destination = "605 Nguyễn Thị Thập, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh";

  const testParams = {
    parameter: {
      origin: origin,
      destination: destination,
      notify: "1",
    },
  };

  console.log("🧪 Testing distance calculation...");
  const result = doGet(testParams);
  console.log("📋 Test result:", result.getContent());
}
