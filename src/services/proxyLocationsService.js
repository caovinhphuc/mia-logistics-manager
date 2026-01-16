class ProxyLocationsService {
  constructor() {
    this.sheetName = 'Locations';
  }

  async getLocations() {
    try {
      // Get data from backend API instead of googleSheetsService
      const response = await fetch('/api/locations');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data || data.length === 0) {
        return [];
      }

      // Backend returns objects, not rows - just map to LocationManager format
      const locations = data
        .map((row) => ({
          locationId: row.id || `loc_${Date.now()}`,
          name: row.code || '',
          type: row.category || 'warehouse',
          address: row.address || '',
          latitude: 0, // Not in Locations sheet
          longitude: 0, // Not in Locations sheet
          phone: '', // Not in Locations sheet
          contactPerson: '', // Not in Locations sheet
          capacity: 0, // Not in Locations sheet
          operatingHours: '', // Not in Locations sheet
          status: row.status || 'active',
          createdDate: row.createdAt || new Date().toISOString(),
          updatedDate: row.updatedAt || new Date().toISOString(),
          // Additional fields from Locations sheet
          code: row.code,
          avatar: row.avatar,
          subcategory: row.subcategory,
          ward: row.ward,
          district: row.district,
          province: row.province,
          note: row.note,
        }))
        .filter((location) => location.status !== 'deleted');

      return locations;
    } catch (error) {
      console.error('Error getting locations:', error);
      throw new Error('Không thể tải dữ liệu địa điểm');
    }
  }

  async getLocationStats() {
    try {
      const locations = await this.getLocations();

      const stats = {
        total: locations.length,
        active: locations.filter((loc) => loc.status === 'active').length,
        inactive: locations.filter((loc) => loc.status === 'inactive').length,
        warehouse: locations.filter((loc) => loc.type === 'warehouse').length,
        distribution: locations.filter((loc) => loc.type === 'distribution').length,
        office: locations.filter((loc) => loc.type === 'office').length,
        customer: locations.filter((loc) => loc.type === 'customer').length,
        partner: locations.filter((loc) => loc.type === 'partner').length,
      };

      return stats;
    } catch (error) {
      console.error('Error getting location stats:', error);
      throw new Error('Không thể tải thống kê địa điểm');
    }
  }

  async addLocation(locationData) {
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: locationData.code || locationData.name,
          avatar: locationData.avatar || '🏢',
          category: locationData.category || locationData.type,
          subcategory: locationData.subcategory || '',
          address: locationData.address || '',
          status: locationData.status || 'active',
          ward: locationData.ward || '',
          district: locationData.district || '',
          province: locationData.province || '',
          note: locationData.note || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Địa điểm đã được thêm thành công',
      };
    } catch (error) {
      console.error('Error adding location:', error);
      throw new Error('Không thể thêm địa điểm mới');
    }
  }

  async updateLocation(locationId, locationData) {
    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: locationData.code || locationData.name,
          avatar: locationData.avatar || '🏢',
          category: locationData.category || locationData.type,
          subcategory: locationData.subcategory || '',
          address: locationData.address || '',
          status: locationData.status || 'active',
          ward: locationData.ward || '',
          district: locationData.district || '',
          province: locationData.province || '',
          note: locationData.note || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Địa điểm đã được cập nhật thành công',
      };
    } catch (error) {
      console.error('Error updating location:', error);
      throw new Error('Không thể cập nhật địa điểm');
    }
  }

  async deleteLocation(locationId) {
    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Địa điểm đã được xóa thành công',
      };
    } catch (error) {
      console.error('Error deleting location:', error);
      throw new Error('Không thể xóa địa điểm');
    }
  }

  // Get locations by type
  async getLocationsByType(type) {
    try {
      const allLocations = await this.getLocations();
      return allLocations.filter((location) => location.type === type);
    } catch (error) {
      console.error('Error getting locations by type:', error);
      throw new Error('Không thể lấy dữ liệu địa điểm theo loại');
    }
  }

  // Get locations by status
  async getLocationsByStatus(status) {
    try {
      const allLocations = await this.getLocations();
      return allLocations.filter((location) => location.status === status);
    } catch (error) {
      console.error('Error getting locations by status:', error);
      throw new Error('Không thể lấy dữ liệu địa điểm theo trạng thái');
    }
  }

  // Search locations by name or address
  async searchLocations(query) {
    try {
      const allLocations = await this.getLocations();
      const searchQuery = query.toLowerCase();

      return allLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery) ||
          location.address.toLowerCase().includes(searchQuery) ||
          location.contactPerson.toLowerCase().includes(searchQuery)
      );
    } catch (error) {
      console.error('Error searching locations:', error);
      throw new Error('Không thể tìm kiếm địa điểm');
    }
  }
}

// Create and export singleton instance
export const proxyLocationsService = new ProxyLocationsService();
