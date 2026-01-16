// src/services/googleSheets/carriersService.ts
import { SHEETS_CONFIG } from '../../config/sheetsConfig';
import { BaseGoogleSheetsService } from './baseService';

export interface Carrier {
  carrierId: string;
  name: string;
  avatarUrl?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  serviceAreas: string;
  pricingMethod: 'PER_KM' | 'PER_M3' | 'PER_TRIP' | 'PER_KG';
  baseRate: number;
  perKmRate: number;
  perM3Rate: number;
  perTripRate: number;
  fuelSurcharge: number;
  remoteAreaFee: number;
  insuranceRate: number;
  vehicleTypes: string;
  maxWeight: number;
  maxVolume: number;
  operatingHours: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CarriersService extends BaseGoogleSheetsService {
  private normalizeBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === 'TRUE';
    }
    return Boolean(value);
  }
  async getCarriers(): Promise<Carrier[]> {
    const carriers = await this.getRecords<Carrier>(SHEETS_CONFIG.SHEETS.CARRIERS);
    // Normalize boolean values from Google Sheets
    return carriers.map((carrier) => ({
      ...carrier,
      isActive: this.normalizeBoolean(carrier.isActive),
      baseRate: Number(carrier.baseRate) || 0,
      perKmRate: Number(carrier.perKmRate) || 0,
      perM3Rate: Number(carrier.perM3Rate) || 0,
      perTripRate: Number(carrier.perTripRate) || 0,
      fuelSurcharge: Number(carrier.fuelSurcharge) || 0,
      remoteAreaFee: Number(carrier.remoteAreaFee) || 0,
      insuranceRate: Number(carrier.insuranceRate) || 0,
      maxWeight: Number(carrier.maxWeight) || 0,
      maxVolume: Number(carrier.maxVolume) || 0,
      rating: Number(carrier.rating) || 0,
    }));
  }

  async getActiveCarriers(): Promise<Carrier[]> {
    const carriers = await this.getCarriers();
    return carriers.filter((carrier) => this.normalizeBoolean(carrier.isActive));
  }

  async getCarrierById(carrierId: string): Promise<Carrier | null> {
    const carriers = await this.getCarriers();
    return carriers.find((carrier) => carrier.carrierId === carrierId) || null;
  }

  async addCarrier(
    carrierData: Omit<Carrier, 'carrierId' | 'createdAt' | 'updatedAt'>
  ): Promise<Carrier> {
    const carrier: Carrier = {
      ...carrierData,
      carrierId: `CAR-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.addRecord(
      SHEETS_CONFIG.SHEETS.CARRIERS,
      carrier as unknown as Record<string, unknown>
    );
    return carrier;
  }

  async updateCarrier(carrierId: string, updates: Partial<Carrier>): Promise<Carrier> {
    // Ensure boolean values are properly formatted for Google Sheets
    const formattedUpdates = { ...updates };
    if ('isActive' in formattedUpdates) {
      formattedUpdates.isActive = formattedUpdates.isActive ? 'TRUE' : 'FALSE';
    }

    const updatedCarrier = (await this.updateRecord(
      SHEETS_CONFIG.SHEETS.CARRIERS,
      carrierId,
      'carrierId',
      formattedUpdates as unknown as Record<string, unknown>
    )) as unknown as Promise<Carrier>;

    // Return normalized data
    return {
      ...updatedCarrier,
      isActive: this.normalizeBoolean(updatedCarrier.isActive),
    };
  }

  async deleteCarrier(carrierId: string): Promise<boolean> {
    return this.deleteRecord(SHEETS_CONFIG.SHEETS.CARRIERS, carrierId, 'carrierId');
  }

  calculateShippingCost(
    carrier: Carrier,
    distance: number,
    volume: number,
    weight: number
  ): number {
    let baseCost = carrier.baseRate;

    switch (carrier.pricingMethod) {
      case 'PER_KM':
        baseCost += distance * carrier.perKmRate;
        break;
      case 'PER_M3':
        baseCost += volume * carrier.perM3Rate;
        break;
      case 'PER_TRIP':
        baseCost = carrier.perTripRate;
        break;
      case 'PER_KG':
        baseCost += weight * carrier.perKmRate; // Reuse rate field
        break;
    }

    // Apply surcharges
    const fuelCost = baseCost * carrier.fuelSurcharge;
    const insuranceCost = baseCost * carrier.insuranceRate;

    return Math.round(baseCost + fuelCost + insuranceCost + carrier.remoteAreaFee);
  }
}
