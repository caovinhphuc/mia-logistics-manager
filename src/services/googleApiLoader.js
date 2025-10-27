// Google API Client Loader
// ========================
// Proper client-side Google API loading service

import { CONSTANTS } from "../utils/constants";

class GoogleApiLoader {
  constructor() {
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
  }

  // Load Google API script
  async loadGoogleApi() {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.isLoading) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this._loadScript();

    try {
      await this.loadPromise;
      this.isLoaded = true;
      this.isLoading = false;
      console.log("✅ Google API script loaded successfully");
      return Promise.resolve();
    } catch (error) {
      this.isLoading = false;
      console.error("❌ Failed to load Google API script:", error);
      throw error;
    }
  }

  // Load Google API script via DOM
  _loadScript() {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="apis.google.com"]',
      );
      if (existingScript) {
        if (window.gapi) {
          resolve();
          return;
        }
      }

      // Create script element
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.gapi) {
          resolve();
        } else {
          reject(
            new Error("Google API (gapi) not available after script load"),
          );
        }
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google API script"));
      };

      document.head.appendChild(script);
    });
  }

  // Initialize Google API client
  async initializeClient() {
    try {
      await this.loadGoogleApi();

      if (!window.gapi) {
        throw new Error("Google API (gapi) not available");
      }

      // Load the client
      await new Promise((resolve, reject) => {
        window.gapi.load("client:auth2", {
          callback: resolve,
          onerror: reject,
        });
      });

      // Initialize the client
      await window.gapi.client.init({
        apiKey: CONSTANTS.GOOGLE.API_KEY,
        clientId: CONSTANTS.GOOGLE.CLIENT_ID,
        discoveryDocs: [
          "https://sheets.googleapis.com/$discovery/rest?version=v4",
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          "https://script.googleapis.com/$discovery/rest?version=v1",
        ],
        scope: CONSTANTS.GOOGLE.SCOPES.join(" "),
      });

      console.log("✅ Google API client initialized successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize Google API client:", error);
      throw error;
    }
  }

  // Get authentication instance
  getAuthInstance() {
    if (!window.gapi || !window.gapi.auth2) {
      throw new Error("Google Auth not available");
    }
    return window.gapi.auth2.getAuthInstance();
  }

  // Check if user is signed in
  isSignedIn() {
    try {
      const authInstance = this.getAuthInstance();
      return authInstance.isSignedIn.get();
    } catch (error) {
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      const authInstance = this.getAuthInstance();
      if (!this.isSignedIn()) {
        return null;
      }
      return authInstance.currentUser.get();
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  // Sign in
  async signIn() {
    try {
      const authInstance = this.getAuthInstance();
      const user = await authInstance.signIn();
      console.log("✅ User signed in successfully");
      return user;
    } catch (error) {
      console.error("❌ Sign in failed:", error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      const authInstance = this.getAuthInstance();
      await authInstance.signOut();
      console.log("✅ User signed out successfully");
    } catch (error) {
      console.error("❌ Sign out failed:", error);
      throw error;
    }
  }

  // Get access token
  getAccessToken() {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        return null;
      }
      return user.getAuthResponse().access_token;
    } catch (error) {
      console.error("Failed to get access token:", error);
      return null;
    }
  }

  // Get authorization headers
  getAuthHeaders() {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token available");
    }

    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  // Check API status
  getStatus() {
    return {
      scriptLoaded: this.isLoaded,
      gapiAvailable: !!window.gapi,
      clientAvailable: !!(window.gapi && window.gapi.client),
      authAvailable: !!(window.gapi && window.gapi.auth2),
      isSignedIn: this.isSignedIn(),
      hasApiKey: !!CONSTANTS.GOOGLE.API_KEY,
      hasClientId: !!CONSTANTS.GOOGLE.CLIENT_ID,
      hasSpreadsheetId: !!CONSTANTS.GOOGLE.SPREADSHEET_ID,
    };
  }
}

// Export singleton instance
export const googleApiLoader = new GoogleApiLoader();
export default googleApiLoader;
