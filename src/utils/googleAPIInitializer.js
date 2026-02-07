// Google API Initialization Script
// Được tạo tự động bởi initGoogleAPI.js

class GoogleAPIInitializer {
  constructor() {
    this.isInitialized = false;
    this.isAuthenticated = false;
    this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  }

  async initialize() {
    try {
      logger.debug('🔄 Khởi tạo Google API...');

      // Kiểm tra API key
      if (!this.apiKey) {
        throw new Error('Google API Key chưa được cấu hình');
      }

      // Load Google API
      if (typeof window !== 'undefined' && window.gapi) {
        await window.gapi.load('client', async () => {
          await window.gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets',
          });

          this.isInitialized = true;
          logger.debug('✅ Google API đã được khởi tạo');
        });
      } else {
        throw new Error('Google API chưa được load');
      }
    } catch (error) {
      console.error('❌ Lỗi khởi tạo Google API:', error);
      throw error;
    }
  }

  async authenticate() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      logger.debug('🔄 Authenticate với Google...');

      // Authenticate với Google
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        throw new Error('Google Auth chưa được khởi tạo');
      }

      const user = await authInstance.signIn();
      this.isAuthenticated = true;

      logger.debug('✅ Đã authenticate với Google');
      return user;
    } catch (error) {
      console.error('❌ Lỗi authenticate:', error);
      throw error;
    }
  }

  async checkAuthStatus() {
    try {
      if (!this.isInitialized) {
        return false;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        return false;
      }

      const isSignedIn = authInstance.isSignedIn.get();
      this.isAuthenticated = isSignedIn;

      return isSignedIn;
    } catch (error) {
      console.error('❌ Lỗi kiểm tra auth status:', error);
      return false;
    }
  }

  async getAuthToken() {
    try {
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = authInstance.currentUser.get();
      const authResponse = user.getAuthResponse();

      return authResponse.access_token;
    } catch (error) {
      console.error('❌ Lỗi lấy auth token:', error);
      throw error;
    }
  }
}

// Export instance
const googleAPIInitializer = new GoogleAPIInitializer();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', async () => {
    try {
      await googleAPIInitializer.initialize();
      logger.debug('✅ Google API đã sẵn sàng');
    } catch (error) {
      console.error('❌ Lỗi auto-initialize Google API:', error);
    }
  });
}

export default googleAPIInitializer;
