// Mock Google Maps Service
export class GoogleMapsService {
  async searchPlaces(query: string): Promise<Array<{ formatted_address: string }>> {
    // Mock implementation - return some Vietnamese locations
    const mockResults = [
      { formatted_address: 'Hà Nội, Việt Nam' },
      { formatted_address: 'Quận Ba Đình, Hà Nội, Việt Nam' },
      { formatted_address: 'Phường Phúc Xá, Quận Ba Đình, Hà Nội, Việt Nam' },
      { formatted_address: 'TP. Hồ Chí Minh, Việt Nam' },
      { formatted_address: 'Quận 1, TP. Hồ Chí Minh, Việt Nam' },
      { formatted_address: 'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam' },
      { formatted_address: 'Đà Nẵng, Việt Nam' },
      { formatted_address: 'Quận Hải Châu, Đà Nẵng, Việt Nam' },
      { formatted_address: 'Phường Thạch Thang, Quận Hải Châu, Đà Nẵng, Việt Nam' },
    ];

    // Filter results based on query
    return mockResults.filter((result) =>
      result.formatted_address.toLowerCase().includes(query.toLowerCase())
    );
  }
}
