/**
 * API Debug Test - Mock implementation
 * For use in Settings components
 */

export const runDebugTest = async () => {
  try {
    const debugInfo = {
      window: {
        gapi: !!window.gapi,
        gapiClient: !!window.gapi?.client,
        gapiAuth2: !!window.gapi?.auth2,
      },
      process: {
        nodeEnv: process.env.NODE_ENV,
        reactAppGoogleClientId: !!process.env.REACT_APP_GOOGLE_CLIENT_ID,
        reactAppGoogleApiKey: !!process.env.REACT_APP_GOOGLE_API_KEY,
      },
      timestamp: new Date().toISOString(),
    };

    // eslint-disable-next-line no-console
    logger.debug('🔍 Debug Test Results:', debugInfo);

    return {
      success: true,
      debugInfo,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export default runDebugTest;
