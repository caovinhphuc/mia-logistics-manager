import { GOOGLE_CONFIG } from "../config/google.js";
import { googleApiLoader } from "./googleApiLoader";
import { hashPassword, verifyPassword } from "../utils/passwordUtils";

class GoogleAuthService {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.authToken = null;
    this.useGoogleSheets = process.env.REACT_APP_USE_GOOGLE_SHEETS !== 'false';
  }

  async initialize() {
    try {
      await googleApiLoader.initializeClient();
      console.log("✅ Google Auth Service initialized");
    } catch (error) {
      console.error("❌ Google Auth Service initialization failed:", error);
      throw error;
    }
  }

  async getAuthHeaders() {
    if (!window.gapi || !window.gapi.auth2) {
      throw new Error("Google API not initialized");
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const authResponse = user.getAuthResponse(true);

    return {
      Authorization: `Bearer ${authResponse.access_token}`,
      "Content-Type": "application/json",
    };
  }

  async getCurrentUser() {
    try {
      if (!window.gapi || !window.gapi.auth2) {
        return null;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      const googleUser = authInstance.currentUser.get();

      if (!googleUser || !googleUser.isSignedIn()) {
        return null;
      }

      const profile = googleUser.getBasicProfile();
      this.currentUser = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
      };

      this.isAuthenticated = true;
      return this.currentUser;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Get mock users with hashed passwords (SHA-256)
  getMockUsers() {
    return {
      "admin@mialogistics.com": {
        id: "user_001",
        email: "admin@mialogistics.com",
        password: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // admin123 (SHA-256)
        name: "Admin User",
        role: "admin",
        department: "IT",
        phone: "0901234567",
        status: "active",
        picture: null,
      },
      "manager@mialogistics.com": {
        id: "user_002",
        email: "manager@mialogistics.com",
        password: "866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5", // manager123 (SHA-256)
        name: "Manager User",
        role: "manager",
        department: "Operations",
        phone: "0901234568",
        status: "active",
        picture: null,
      },
      "operator@mialogistics.com": {
        id: "user_003",
        email: "operator@mialogistics.com",
        password: "ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d", // operator123 (SHA-256)
        name: "Operator User",
        role: "operator",
        department: "Warehouse",
        phone: "0901234569",
        status: "active",
        picture: null,
      },
      "driver@mialogistics.com": {
        id: "user_004",
        email: "driver@mialogistics.com",
        password: "494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382", // driver123 (SHA-256)
        name: "Driver User",
        role: "driver",
        department: "Transport",
        phone: "0901234570",
        status: "active",
        picture: null,
      },
    };
  }

  // Get users from Google Sheets
  async getUsersFromSheets() {
    try {
      if (!window.gapi || !window.gapi.client) {
        throw new Error("Google API not initialized");
      }

      const spreadsheetId = GOOGLE_CONFIG.SPREADSHEET_ID;
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "Users!A:Z",
      });

      const rows = response.result.values;
      if (!rows || rows.length < 2) {
        return {};
      }

      // First row is headers
      const headers = rows[0];
      const users = {};

      // Process data rows
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const user = {};

        headers.forEach((header, index) => {
          user[header.toLowerCase()] = row[index] || "";
        });

        if (user.email) {
          users[user.email] = user;
        }
      }

      console.log("✅ Loaded users from Google Sheets:", Object.keys(users).length);
      return users;
    } catch (error) {
      console.warn("⚠️ Could not load users from Google Sheets:", error);
      return null;
    }
  }

    // Verify password
  async checkPassword(plainPassword, hashedPassword) {
    try {
      // Try SHA-256 hash first
      const isValidHash = await verifyPassword(plainPassword, hashedPassword);
      if (isValidHash) {
        return true;
      }

      // Fallback to plain text (backward compatibility)
      return hashedPassword === plainPassword;
    } catch (error) {
      console.error("Password verification error:", error);
      return false;
    }
  }

  async login(email, password) {
    try {
      console.log("🔐 Attempting login:", email);

      let users = {};
      let user = null;

      // Try to load from Google Sheets first
      if (this.useGoogleSheets) {
        const sheetsUsers = await this.getUsersFromSheets();
        if (sheetsUsers && Object.keys(sheetsUsers).length > 0) {
          users = sheetsUsers;
          console.log("📊 Using Google Sheets for authentication");
        } else {
          // Fallback to mock users
          users = this.getMockUsers();
          console.log("📝 Using mock users for authentication");
        }
      } else {
        // Use mock users
        users = this.getMockUsers();
        console.log("📝 Using mock users for authentication");
      }

      // Check if user exists
      user = users[email];
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Check password
      const isPasswordValid = await this.checkPassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Check if user is active
      if (user.status && user.status !== "active") {
        throw new Error("Account is not active");
      }

      // Set current user
      this.currentUser = {
        id: user.id || user.userid,
        email: user.email,
        name: user.name || user.fullname,
        role: user.role || "operator",
        department: user.department || "",
        phone: user.phone || "",
        status: user.status || "active",
        picture: user.picture || user.avatar || null,
      };

      this.isAuthenticated = true;
      console.log("✅ Login successful:", this.currentUser);
      return this.currentUser;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }

  // Hash password
  async hashUserPassword(plainPassword) {
    try {
      return await hashPassword(plainPassword);
    } catch (error) {
      console.error("Password hashing error:", error);
      throw error;
    }
  }

  async loginWithGoogle(token) {
    try {
      this.authToken = token;
      this.isAuthenticated = true;
      return this.currentUser;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
      }

      this.isAuthenticated = false;
      this.currentUser = null;
      this.authToken = null;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  isGoogleUser() {
    return this.isAuthenticated && !!this.authToken;
  }
}

export const googleAuthService = new GoogleAuthService();
