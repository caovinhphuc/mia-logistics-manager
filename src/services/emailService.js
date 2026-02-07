/**
 * Email Service - Mock implementation
 * For use in Settings components
 */

export const emailService = {
  testConnection: async () => {
    return {
      success: false,
      error: 'Email service not implemented yet',
      method: null,
    };
  },

  sendNotification: async (to, subject, message, data) => {
    // eslint-disable-next-line no-console
    logger.debug('Email service mock - sendNotification:', { to, subject, message, data });
    return {
      success: false,
      method: 'mock',
      error: 'Email service not implemented yet',
    };
  },

  sendAlert: async (to, level, title, message, data) => {
    // eslint-disable-next-line no-console
    logger.debug('Email service mock - sendAlert:', { to, level, title, message, data });
    return {
      success: false,
      method: 'mock',
      error: 'Email service not implemented yet',
    };
  },
};

export default emailService;
