// React hooks for Google Sheets data integration
import { useCallback, useEffect, useState } from 'react';
import GoogleSheetsService from '../services/googleSheets.js';

// Hook for locations data
export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoogleSheetsService.getLocations();
      setLocations(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLocation = useCallback(
    async (locationData) => {
      try {
        await GoogleSheetsService.addLocation(locationData);
        // Refresh data after adding
        await fetchLocations();
        return true;
      } catch (err) {
        setError(err.message);
        console.error('Error adding location:', err);
        return false;
      }
    },
    [fetchLocations]
  );

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    loading,
    error,
    refetch: fetchLocations,
    addLocation,
  };
};

// Hook for employees data
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoogleSheetsService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
  };
};

// Hook for carriers data
export const useCarriers = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCarriers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoogleSheetsService.getCarriers();
      setCarriers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching carriers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarriers();
  }, [fetchCarriers]);

  return {
    carriers,
    loading,
    error,
    refetch: fetchCarriers,
  };
};

// Hook for transport requests data
export const useTransportRequests = () => {
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransportRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoogleSheetsService.getTransportRequests();
      setTransportRequests(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transport requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransportRequests();
  }, [fetchTransportRequests]);

  return {
    transportRequests,
    loading,
    error,
    refetch: fetchTransportRequests,
  };
};

// Hook for connection testing
export const useGoogleSheetsConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const [error, setError] = useState(null);

  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus('checking');
      setError(null);
      const isConnected = await GoogleSheetsService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');
      if (!isConnected) {
        setError('Failed to connect to Google Sheets');
      }
      return isConnected;
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
      console.error('Connection test failed:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    connectionStatus,
    error,
    testConnection,
  };
};

// Combined hook for dashboard stats
export const useDashboardStats = () => {
  const { locations } = useLocations();
  const { employees } = useEmployees();
  const { carriers } = useCarriers();
  const { transportRequests } = useTransportRequests();

  const stats = {
    totalLocations: locations.length,
    activeLocations: locations.filter((loc) => loc.Status === 'Active').length,
    totalEmployees: employees.length,
    activeEmployees: employees.filter((emp) => emp.Status === 'Active').length,
    totalCarriers: carriers.length,
    activeCarriers: carriers.filter((carrier) => carrier.Status === 'Active').length,
    totalTransportRequests: transportRequests.length,
    pendingRequests: transportRequests.filter((req) => req.Status === 'Pending').length,
    completedRequests: transportRequests.filter((req) => req.Status === 'Completed').length,
  };

  return stats;
};
