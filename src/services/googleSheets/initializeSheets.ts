// src/services/googleSheets/initializeSheets.ts
import {
  CARRIERS_HEADERS,
  ORDERS_HEADERS,
  SHEETS_CONFIG,
  INBOUND_INTERNATIONAL_HEADERS,
} from '../../config/sheetsConfig';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { logService } from '../logService';

const sheetsInitLogger = {
  info: (message: string, data?: unknown) =>
    logService.info('InitializeGoogleSheets', message, data ? { data } : {}),
  error: (message: string, error: unknown) =>
    logService.error('InitializeGoogleSheets', message, {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    }),
};

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

export async function initializeGoogleSheets() {
  try {
    const doc = new GoogleSpreadsheet(SHEETS_CONFIG.SPREADSHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    // Tạo Orders sheet nếu chưa có
    let ordersSheet = doc.sheetsByTitle[SHEETS_CONFIG.SHEETS.ORDERS];
    if (!ordersSheet) {
      ordersSheet = await doc.addSheet({
        title: SHEETS_CONFIG.SHEETS.ORDERS,
        headerValues: ORDERS_HEADERS,
      });
    }

    // Tạo Carriers sheet nếu chưa có
    let carriersSheet = doc.sheetsByTitle[SHEETS_CONFIG.SHEETS.CARRIERS];
    if (!carriersSheet) {
      carriersSheet = await doc.addSheet({
        title: SHEETS_CONFIG.SHEETS.CARRIERS,
        headerValues: CARRIERS_HEADERS,
      });

      // Thêm dữ liệu mẫu cho carriers
      await carriersSheet.addRows([
        {
          carrierId: 'CAR001',
          name: 'Giao Hàng Nhanh Express',
          contactPerson: 'Nguyễn Văn A',
          email: 'contact@ghnexpress.com',
          phone: '0901234567',
          address: 'Hà Nội',
          serviceAreas: 'Toàn quốc',
          pricingMethod: 'PER_KM',
          baseRate: 50000,
          perKmRate: 5000,
          perM3Rate: 0,
          perTripRate: 0,
          fuelSurcharge: 0.1,
          remoteAreaFee: 20000,
          insuranceRate: 0.005,
          vehicleTypes: 'Van,Truck',
          maxWeight: 1000,
          maxVolume: 10,
          operatingHours: '06:00-22:00',
          rating: 4.5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          carrierId: 'CAR002',
          name: 'Viettel Post',
          contactPerson: 'Trần Thị B',
          email: 'business@viettelpost.vn',
          phone: '0987654321',
          address: 'TP.HCM',
          serviceAreas: 'Miền Nam',
          pricingMethod: 'PER_M3',
          baseRate: 30000,
          perKmRate: 0,
          perM3Rate: 80000,
          perTripRate: 0,
          fuelSurcharge: 0.08,
          remoteAreaFee: 15000,
          insuranceRate: 0.003,
          vehicleTypes: 'Motorbike,Van',
          maxWeight: 500,
          maxVolume: 5,
          operatingHours: '07:00-21:00',
          rating: 4.2,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }

    // Tạo InboundInternational sheet nếu chưa có
    let inboundInternationalSheet = doc.sheetsByTitle[SHEETS_CONFIG.SHEETS.INBOUND_INTERNATIONAL];
    if (!inboundInternationalSheet) {
      inboundInternationalSheet = await doc.addSheet({
        title: SHEETS_CONFIG.SHEETS.INBOUND_INTERNATIONAL,
        headerValues: INBOUND_INTERNATIONAL_HEADERS,
      });
    }

    sheetsInitLogger.info('Google Sheets initialized successfully');
    return doc;
  } catch (error) {
    sheetsInitLogger.error('Error initializing Google Sheets', error);
    throw error;
  }
}
