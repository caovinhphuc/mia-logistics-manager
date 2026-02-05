/**
 * Distance Service
 * Service để tính toán khoảng cách và thời gian di chuyển giữa 2 điểm
 * Sử dụng Google Maps Distance Matrix API
 */

export interface DistanceResult {
  distance: {
    text: string; // "15 km"
    value: number; // 15000 (meters)
  };
  duration: {
    text: string; // "20 mins"
    value: number; // 1200 (seconds)
  };
  status: string; // "OK"
}

export interface DistanceMatrixResponse {
  status: string;
  rows: Array<{
    elements: DistanceResult[];
  }>;
}

export class DistanceService {
  /**
   * Test connectivity to Google Apps Script
   * @returns {Promise<boolean>}
   */
  static async testConnectivity(): Promise<boolean> {
    // Mock test - trong production sẽ gọi Google Apps Script
    return true;
  }

  /**
   * Tính khoảng cách giữa 2 điểm
   * @param origin - Điểm xuất phát
   * @param destination - Điểm đến
   * @returns {Promise<DistanceResult>}
   */
  static async calculateDistance(_origin: string, _destination: string): Promise<DistanceResult> {
    // Mock implementation - trong production sẽ gọi Google Apps Script
    return {
      distance: {
        text: '15 km',
        value: 15000,
      },
      duration: {
        text: '20 phút',
        value: 1200,
      },
      status: 'OK',
    };
  }

  /**
   * Tính khoảng cách giữa nhiều điểm (route optimization)
   * @param waypoints - Danh sách các điểm cần đi qua
   * @returns {Promise<DistanceResult[]>}
   */
  static async calculateRoute(waypoints: string[]): Promise<DistanceResult[]> {
    try {
      // Mock implementation - trong production sẽ gọi Google Apps Script
      return waypoints.map(() => ({
        distance: {
          text: '10 km',
          value: 10000,
        },
        duration: {
          text: '15 phút',
          value: 900,
        },
        status: 'OK',
      }));
    } catch (error) {
      console.error('DistanceService.calculateRoute error:', error);
      throw error;
    }
  }

  /**
   * Tính khoảng cách địa lý (Haversine formula) - cho biết khoảng cách đường chim bay
   * @param lat1 - Vĩ độ điểm 1
   * @param lon1 - Kinh độ điểm 1
   * @param lat2 - Vĩ độ điểm 2
   * @param lon2 - Kinh độ điểm 2
   * @returns {number} - Khoảng cách tính bằng km
   */
  static calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Khoảng cách (km)

    return distance;
  }

  /**
   * Chuyển đổi độ sang radian
   * @param degrees - Số độ
   * @returns {number} - Radian
   */
  private static toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Tối ưu hóa tuyến đường (Traveling Salesman Problem approximation)
   * @param waypoints - Danh sách các điểm cần đi qua
   * @returns {Promise<string[]>} - Thứ tự các điểm tối ưu
   */
  static async optimizeRoute(waypoints: string[]): Promise<string[]> {
    try {
      // Mock implementation - trong production sẽ gọi Google Apps Script
      // Sử dụng thuật toán gần đúng cho TSP
      return waypoints;
    } catch (error) {
      console.error('DistanceService.optimizeRoute error:', error);
      throw error;
    }
  }

  /**
   * Tìm địa điểm gần nhất
   * @param origin - Điểm xuất phát
   * @param destinations - Danh sách các điểm đích
   * @returns {Promise<{ destination: string; distance: DistanceResult }>}
   */
  static async findNearest(
    origin: string,
    destinations: string[]
  ): Promise<{ destination: string; distance: DistanceResult }> {
    try {
      // Mock implementation - trong production sẽ gọi Google Apps Script
      const distances = await Promise.all(
        destinations.map(async (dest) => ({
          destination: dest,
          distance: await this.calculateDistance(origin, dest),
        }))
      );

      // Tìm điểm gần nhất
      const nearest = distances.reduce((prev, curr) =>
        curr.distance.value < prev.distance.value ? curr : prev
      );

      return nearest;
    } catch (error) {
      console.error('DistanceService.findNearest error:', error);
      throw error;
    }
  }
}

export default DistanceService;
