// Export all services from a central location
// Optional singleton instances for convenience

import { CarriersService } from './carriersService';

export { InboundInternationalService } from './inboundInternationalService';
export type { InboundInternationalRecord } from './inboundInternationalService';
export { InboundScheduleService } from './inboundScheduleService';
export { CarriersService } from './carriersService';
export type { Carrier } from './carriersService';
export const carriersService = new CarriersService();
