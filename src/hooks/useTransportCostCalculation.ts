import { useState, useCallback } from 'react';

interface TransportCostCalculation {
  distance: number;
  baseCost: number;
  fuelCost: number;
  driverCost: number;
  totalCost: number;
  costPerKm: number;
}

export const useTransportCostCalculation = () => {
  const [calculation, setCalculation] = useState<TransportCostCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateCost = useCallback(async (distance: number, _vehicleType: string) => {
    setLoading(true);
    try {
      // Mock calculation logic
      const baseCost = 100000; // 100k VND base cost
      const fuelCost = distance * 2000; // 2k VND per km
      const driverCost = distance * 500; // 500 VND per km
      const totalCost = baseCost + fuelCost + driverCost;
      const costPerKm = totalCost / distance;

      setCalculation({
        distance,
        baseCost,
        fuelCost,
        driverCost,
        totalCost,
        costPerKm,
      });
    } catch (error) {
      console.error('Error calculating transport cost:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCalculation(null);
  }, []);

  return {
    calculation,
    loading,
    calculateCost,
    reset,
  };
};
