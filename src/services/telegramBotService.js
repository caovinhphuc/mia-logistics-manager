/**
 * Telegram Bot Service - Mock implementation
 * For use in Settings components
 */

export const telegramBotService = {
  testConnection: async () => {
    const token = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return {
        success: false,
        error: 'Telegram bot token or chat ID not configured',
      };
    }

    try {
      // Simple test - check if token format is valid
      const isValidFormat = /^\d+:[A-Za-z0-9_-]+$/.test(token);
      return {
        success: isValidFormat,
        botInfo: isValidFormat ? { token: token.substring(0, 10) + '...' } : null,
        error: isValidFormat ? null : 'Invalid token format',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  getBotInfo: async () => {
    return {
      id: null,
      username: null,
      first_name: 'Telegram Bot (Mock)',
    };
  },

  sendMessage: async (message) => {
    // eslint-disable-next-line no-console
    logger.debug('Telegram service mock - sendMessage:', message);
    return {
      success: false,
      error: 'Telegram service not fully implemented yet',
    };
  },

  sendAlert: async (title, message, level, data) => {
    // eslint-disable-next-line no-console
    logger.debug('Telegram service mock - sendAlert:', { title, message, level, data });
    return {
      success: false,
      error: 'Telegram service not fully implemented yet',
    };
  },
};

export default telegramBotService;
