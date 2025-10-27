import { googleSheetsService } from '../googleSheetsService';

class ProxyLocationsService {
  constructor() {
    this.sheetName = 'Locations_Data';
  }

  async getLocations() {
    try {
      // Get data from Google Sheets
      const data = await googleSheetsService.getValues(this.sheetName);

      if (!data || data.length === 0) {
        return [];
      }

      // Skip header row and transform data, filtering out deleted items
      const locations = data.slice(1)
        .map((row, index) => {
          const [
            name,
            type,
            address,
            latitude,
            longitude,
            phone,
            contactPerson,
            capacity,
            operatingHours,
            status,
            createdDate,
            updatedDate
          ] = row;

          return {
            locationId: `loc_${index + 1}`,
            name: name || '',
            type: type || 'warehouse',
            address: address || '',
            latitude: latitude ? parseFloat(latitude) : 0,
            longitude: longitude ? parseFloat(longitude) : 0,
            phone: phone || '',
            contactPerson: contactPerson || '',
            capacity: capacity ? parseFloat(capacity) : 0,
            operatingHours: operatingHours || '',
            status: status || 'active',
            createdDate: createdDate || new Date().toISOString(),
            updatedDate: updatedDate || new Date().toISOString()
          };
        })
        .filter(location => location.status !== 'deleted'); // Filter out deleted locations

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
        active: locations.filter(loc => loc.status === 'active').length,
        inactive: locations.filter(loc => loc.status === 'inactive').length,
        warehouse: locations.filter(loc => loc.type === 'warehouse').length,
        distribution: locations.filter(loc => loc.type === 'distribution').length,
        office: locations.filter(loc => loc.type === 'office').length,
        customer: locations.filter(loc => loc.type === 'customer').length,
        partner: locations.filter(loc => loc.type === 'partner').length
      };

      return stats;
    } catch (error) {
      console.error('Error getting location stats:', error);
      throw new Error('Không thể tải thống kê địa điểm');
    }
  }

  async addLocation(locationData) {
    try {
      // Get current data to determine next row
      const currentData = await googleSheetsService.getValues(this.sheetName);
      const nextRowIndex = currentData ? currentData.length + 1 : 2; // +1 for 1-based indexing, +1 for header

      const newRow = [
        locationData.name,
        locationData.type,
        locationData.address,
        locationData.latitude.toString(),
        locationData.longitude.toString(),
        locationData.phone,
        locationData.contactPerson,
        locationData.capacity.toString(),
        locationData.operatingHours,
        locationData.status,
        new Date().toISOString(),
        new Date().toISOString()
      ];

      await googleSheetsService.appendValues(this.sheetName, [newRow]);

      return {
        success: true,
        message: 'Địa điểm đã được thêm thành công'
      };
    } catch (error) {
      console.error('Error adding location:', error);
      throw new Error('Không thể thêm địa điểm mới');
    }
  }

  async updateLocation(locationId, locationData) {
    try {
      // Get current data to find the row index
      const currentData = await googleSheetsService.getValues(this.sheetName);

      if (!currentData || currentData.length === 0) {
        throw new Error('Không tìm thấy dữ liệu địa điểm');
      }

      // Find the row index (locationId is based on index)
      const locationIndex = parseInt(locationId.replace('loc_', '')) - 1;
      const rowIndex = locationIndex + 2; // +1 for header, +1 for 0-based to 1-based

      if (locationIndex < 0 || locationIndex >= currentData.length - 1) {
        throw new Error('Không tìm thấy địa điểm cần cập nhật');
      }

      const updatedRow = [
        locationData.name,
        locationData.type,
        locationData.address,
        locationData.latitude.toString(),
        locationData.longitude.toString(),
        locationData.phone,
        locationData.contactPerson,
        locationData.capacity.toString(),
        locationData.operatingHours,
        locationData.status,
        currentData[locationIndex + 1][10] || new Date().toISOString(), // Keep original created date
        new Date().toISOString() // Update modified date
      ];

      await googleSheetsService.updateValues(this.sheetName, `A${rowIndex}:L${rowIndex}`, [updatedRow]);

      return {
        success: true,
        message: 'Địa điểm đã được cập nhật thành công'
      };
    } catch (error) {
      console.error('Error updating location:', error);
      throw new Error('Không thể cập nhật địa điểm');
    }
  }

  async deleteLocation(locationId) {
    try {
      // Get current data to find the row index
      const currentData = await googleSheetsService.getValues(this.sheetName);

      if (!currentData || currentData.length === 0) {
        throw new Error('Không tìm thấy dữ liệu địa điểm');
      }

      // Find the row index (locationId is based on index)
      const locationIndex = parseInt(locationId.replace('loc_', '')) - 1;
      const rowIndex = locationIndex + 2; // +1 for header, +1 for 0-based to 1-based

      if (locationIndex < 0 || locationIndex >= currentData.length - 1) {
        throw new Error('Không tìm thấy địa điểm cần xóa');
      }

      // Mark as deleted by updating status instead of actually deleting the row
      const currentRow = currentData[locationIndex + 1];
      const updatedRow = [...currentRow];
      updatedRow[9] = 'deleted'; // Update status column
      updatedRow[11] = new Date().toISOString(); // Update modified date

      await googleSheetsService.updateValues(this.sheetName, `A${rowIndex}:L${rowIndex}`, [updatedRow]);

      return {
        success: true,
        message: 'Địa điểm đã được xóa thành công'
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
      return allLocations.filter(location => location.type === type);
    } catch (error) {
      console.error('Error getting locations by type:', error);
      throw new Error('Không thể lấy dữ liệu địa điểm theo loại');
    }
  }

  // Get locations by status
  async getLocationsByStatus(status) {
    try {
      const allLocations = await this.getLocations();
      return allLocations.filter(location => location.status === status);
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

      return allLocations.filter(location =>
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
