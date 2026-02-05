// Note: Domestic inbound service now uses backend API instead of direct Google Sheets access thi

// Backend API URL

import type { PackagingItem } from '../inbound/types/inbound';
const API_BASE_URL = 'http://localhost:3100';

export interface InboundDomesticItem {
  id: string;
  date: string;
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'in-transit' | 'arrived' | 'completed' | 'cancelled';
  category: string;
  carrier: string;
  purpose: 'online' | 'offline';
  receiveTime: string;
  estimatedArrival?: string;
  actualArrival?: string;
  pi?: string;
  container?: number;
  // Packaging support (same as International)
  packaging?: PackagingItem[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Note: Row mapping is now handled by the backend API

// Helper: Convert packaging array to flat fields
const serializePackaging = (packaging: PackagingItem[]) => {
  if (!packaging || packaging.length === 0) {
    return {
      packagingTypes: '',
      packagingQuantities: '',
      packagingDescriptions: '',
    };
  }

  return {
    packagingTypes: packaging.map((p) => p.type).join(';'),
    packagingQuantities: packaging.map((p) => p.quantity.toString()).join(';'),
    packagingDescriptions: packaging.map((p) => p.description || '').join(';'),
  };
};

// Helper: Convert flat fields to packaging array
const deserializePackaging = (record: any): PackagingItem[] => {
  const types = (record.packagingTypes || '').split(';').filter(Boolean);
  const quantities = (record.packagingQuantities || '').split(';').filter(Boolean);
  const descriptions = (record.packagingDescriptions || '').split(';').filter(Boolean);

  return types.map((type, index) => ({
    id: `${record.id}-pkg-${index}`,
    type: type.trim(),
    quantity: parseInt(quantities[index] || '0', 10),
    description: (descriptions[index] || '').trim(),
  }));
};

// Get all inbound domestic items
export const getInboundDomesticItems = async (): Promise<InboundDomesticItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inbounddomestic`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const items = Array.isArray(data) ? data : [];

    // Deserialize packaging for each item
    return items.map((record) => ({
      ...record,
      packaging: deserializePackaging(record),
    }));
  } catch (error) {
    console.error('Error fetching inbound domestic items:', error);
    // Fallback to empty array instead of throwing
    return [];
  }
};

// Add new inbound domestic item
export const addInboundDomesticItem = async (
  item: Omit<InboundDomesticItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  try {
    // Serialize packaging to flat fields
    const { packaging, ...itemData } = item;
    const serializedItem = {
      ...itemData,
      ...serializePackaging(packaging || []),
      id: `DOM-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/api/inbounddomestic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serializedItem),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error adding inbound domestic item:', error);
    throw error;
  }
};

// Update inbound domestic item
export const updateInboundDomesticItem = async (
  id: string,
  updates: Partial<InboundDomesticItem>
): Promise<void> => {
  try {
    const updatedItem = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/api/inbounddomestic/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating inbound domestic item:', error);
    throw error;
  }
};

// Delete inbound domestic item
export const deleteInboundDomesticItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inbounddomestic/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting inbound domestic item:', error);
    throw error;
  }
};

// Initialize sheet with headers if it doesn't exist
export const initializeInboundDomesticSheet = async (): Promise<void> => {
  try {
    // Backend handles sheet initialization
    const response = await fetch(`${API_BASE_URL}/api/inbounddomestic/init`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error initializing inbound domestic sheet:', error);
    throw error;
  }
};
