// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Thay thế YOUR_GOOGLE_MAPS_API_KEY bằng API key thực tế
  API_KEY:
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',

  // Distance Matrix API endpoint
  DISTANCE_MATRIX_URL:
    'https://maps.googleapis.com/maps/api/distancematrix/json',

  // Geocoding API endpoint
  GEOCODING_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
};

// Fallback distance calculation (khi không có API key)
export const FALLBACK_DISTANCES = {
  // Khoảng cách mặc định cho các tuyến đường phổ biến tại TP.HCM
  'KTT - lô2-5, Đường CN1': {
    '605 Nguyễn Thị Thập, Phường Tân Hưng, Quận 7': 15.2,
    '415 Cộng Hòa, Phường 15, Quận Tân Bình': 12.8,
    '400 Lũy Bán Bích, Phường Hòa Thạnh, Quận Tân Phú': 8.5,
    '185H Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1': 18.3,
  },
  // Thêm key đầy đủ để match với origin thực tế
  'lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú': {
    '605 Nguyễn Thị Thập, Phường Tân Hưng, Quận 7, Thành phố Hồ Chí Minh': 15.2,
    '415 Cộng Hòa, Phường 15, Quận Tân Bình, Thành phố Hồ Chí Minh': 12.8,
    '400 Lũy Bán Bích, Phường Hòa Thạnh, Quận Tân Phú, Thành phố Hồ Chí Minh': 8.5,
    '185H Cống Quỳnh, Phường Nguyễn Cư Trinh, Quận 1, Thành phố Hồ Chí Minh': 18.3,
    '219 Quang Trung, Phường 10, Quận Gò Vấp, Thành phố Hồ Chí Minh': 14.5,
  },
  // Thêm các tuyến đường khác từ Google Sheets locations
  KHA: {
    COD: 12.5,
    'COD-W': 8.3,
    'Hội chợ 2': 15.7,
  },
  COD: {
    KHA: 12.5,
    'COD-W': 4.2,
    'Hội chợ 2': 8.1,
  },
  'COD-W': {
    KHA: 8.3,
    COD: 4.2,
    'Hội chợ 2': 12.3,
  },
  'Hội chợ 2': {
    KHA: 15.7,
    COD: 8.1,
    'COD-W': 12.3,
  },
  // Thêm khoảng cách cho các địa điểm MIA phổ biến từ KTT
  KTT: {
    MIA1: 18.3, // 185H Cống Quỳnh, Quận 1
    MIA11: 14.5, // 219 Quang Trung, Quận Gò Vấp
    MIA19: 15.2, // 605 Nguyễn Thị Thập, Quận 7
    MIA16: 8.5, // 400 Lũy Bán Bích, Quận Tân Phú
    MIA5: 12.8, // 415 Cộng Hòa, Quận Tân Bình
  },
};

// Helper function để lấy khoảng cách fallback
export const getFallbackDistance = (
  origin: string,
  destination: string
): number => {
  console.log('🔍 Looking for fallback distance:');
  console.log(`📍 Origin: ${origin}`);
  console.log(`📍 Destination: ${destination}`);

  // Tìm trong fallback distances với logic matching tốt hơn
  for (const [key, distances] of Object.entries(FALLBACK_DISTANCES)) {
    console.log(`🔍 Checking key: ${key}`);

    // Kiểm tra origin match (có thể là code hoặc địa chỉ đầy đủ)
    const originMatch =
      origin.includes(key) ||
      key.includes(origin) ||
      origin.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(origin.toLowerCase());

    if (originMatch) {
      console.log(`✅ Found matching origin key: ${key}`);

      for (const [dest, distance] of Object.entries(distances)) {
        console.log(`🔍 Checking destination: ${dest}`);

        // Kiểm tra destination match
        const destMatch =
          destination.includes(dest) ||
          dest.includes(destination) ||
          destination.toLowerCase().includes(dest.toLowerCase()) ||
          dest.toLowerCase().includes(destination.toLowerCase());

        if (destMatch) {
          console.log(
            `✅ Found matching destination: ${dest} = ${distance} km`
          );
          return distance;
        }
      }
    }
  }

  // Thử tìm kiếm theo pattern địa chỉ
  const originCode = extractLocationCode(origin);
  const destCode = extractLocationCode(destination);

  if (originCode && destCode) {
    console.log(`🔍 Trying location codes: ${originCode} -> ${destCode}`);

    for (const [key, distances] of Object.entries(FALLBACK_DISTANCES)) {
      if (key.includes(originCode)) {
        for (const [dest, distance] of Object.entries(distances)) {
          if (dest.includes(destCode)) {
            console.log(
              `✅ Found matching by codes: ${originCode} -> ${destCode} = ${distance} km`
            );
            return distance;
          }
        }
      }
    }
  }

  console.log('❌ No fallback distance found');
  // Không trả về khoảng cách mặc định, để hook xử lý lỗi
  return 0;
};

// Helper function để extract location code từ địa chỉ
const extractLocationCode = (address: string): string | null => {
  // Tìm các pattern phổ biến
  const patterns = [
    /^([A-Z]+)\s*\(/, // KHA (...
    /^([A-Z]+)\s*$/, // KHA
    /^([A-Z]+-[A-Z]+)\s*\(/, // COD-W (...
    /^([A-Z]+-[A-Z]+)\s*$/, // COD-W
    /^([A-Z]+[0-9]+)\s*\(/, // MIA11 (...
    /^([A-Z]+[0-9]+)\s*$/, // MIA11
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};
