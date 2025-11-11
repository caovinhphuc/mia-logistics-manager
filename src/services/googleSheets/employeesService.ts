import { Employee } from '../../shared/types/commonTypes';

const API_BASE_URL = 'http://localhost:5050/api';

export const employeesService = {
  // Lấy danh sách nhân viên
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  // Tạo nhân viên mới
  async createEmployee(
    employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Employee | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating employee:', error);
      return null;
    }
  },

  // Cập nhật nhân viên
  async updateEmployee(
    id: string,
    employee: Partial<Employee>
  ): Promise<Employee | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating employee:', error);
      return null;
    }
  },

  // Xóa nhân viên
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  },
};
