// Google Auth Service - Google OAuth authentication
import { logService } from '../logService';

class GoogleAuthService {
  constructor() {
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.scope = 'https://www.googleapis.com/auth/spreadsheets';
    this.redirectUri = `${window.location.origin}/auth/google/callback`;
  }

  /**
   * Initialize Google Auth
   */
  async initialize() {
    try {
      logService.debug('GoogleAuthService', 'Initializing Google Auth');

      // Load Google API
      return new Promise((resolve) => {
        if (window.gapi) {
          resolve(window.gapi);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.onload = () => {
          resolve(window.gapi);
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      logService.error('GoogleAuthService', 'Failed to initialize', { error });
      throw error;
    }
  }

  /**
   * Get authorization URL
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scope,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for token (backend required)
   */
  async exchangeCodeForToken(code) {
    try {
      logService.debug('GoogleAuthService', 'Exchanging code for token');

      // This should be done via backend for security
      logService.warn('GoogleAuthService', 'Token exchange requires backend implementation');
      throw new Error('Token exchange requires backend support');
    } catch (error) {
      logService.error('GoogleAuthService', 'Failed to exchange code', { error });
      throw error;
    }
  }

  /**
   * Get current auth token
   */
  getToken() {
    return localStorage.getItem('google_auth_token');
  }

  /**
   * Save auth token
   */
  saveToken(token) {
    localStorage.setItem('google_auth_token', token);
    localStorage.setItem('google_auth_timestamp', Date.now().toString());
  }

  /**
   * Clear auth token
   */
  clearToken() {
    localStorage.removeItem('google_auth_token');
    localStorage.removeItem('google_auth_timestamp');
  }

  /**
   * Check if token is valid
   */
  isTokenValid() {
    const token = this.getToken();
    const timestamp = localStorage.getItem('google_auth_timestamp');

    if (!token || !timestamp) {
      return false;
    }

    // Token expires in 1 hour
    const expiryTime = parseInt(timestamp) + 60 * 60 * 1000;
    return Date.now() < expiryTime;
  }
}

export const googleAuthService = new GoogleAuthService();
