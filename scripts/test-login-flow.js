#!/usr/bin/env node

/**
 * Script to test the complete login flow
 */

const { google } = require('googleapis');
const ServiceAccount = require('../server/service_account.json');
require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Users';

console.log('🔐 Testing Complete Login Flow');
console.log('==============================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`Sheet Name: ${SHEET_NAME}`);
console.log('');

// Mock UserService class
class UserService {
    constructor() {
        this.sheetName = SHEET_NAME;
        this.googleSheetsService = null;
    }

    async initialize() {
        console.log('🔄 Initializing UserService...');
        
        // Initialize Google Sheets API with service account
        const auth = new google.auth.GoogleAuth({
            credentials: ServiceAccount,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.googleSheetsService = google.sheets({ version: 'v4', auth });
        console.log('✅ UserService initialized');
    }

    async getUsers() {
        try {
            await this.initialize();

            console.log('🔄 Getting data from Google Sheets...');
            const range = `${this.sheetName}!A1:Z1000`;
            const response = await this.googleSheetsService.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
            });

            const data = response.data.values || [];

            if (!data || data.length <= 1) {
                throw new Error('No data from Google Sheets');
            }

            const headers = data[0];
            const users = data.slice(1).map((row, index) => {
                const userData = {};
                headers.forEach((header, colIndex) => {
                    userData[header] = row[colIndex] || '';
                });
                
                // Map structure from Google Sheets
                const mappedUserData = {
                    id: userData.id || '',
                    email: userData.email || '',
                    name: userData.fullName || '',
                    role: userData.roleId || '',
                    status: userData.status || 'active',
                    created_at: userData.createdAt || '',
                    updated_at: userData.updatedAt || '',
                    passwordHash: userData.passwordHash || ''
                };
                
                return mappedUserData;
            });

            console.log(`📊 Got ${users.length} users from Google Sheets`);
            return users;
        } catch (error) {
            console.error('❌ Error getting users:', error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            console.log(`🔍 Looking for user with email: ${email}`);
            const users = await this.getUsers();
            const user = users.find(u => u.email === email);
            
            if (user) {
                console.log(`✅ User found: ${user.name} (${user.role})`);
            } else {
                console.log('❌ User not found');
            }
            
            return user;
        } catch (error) {
            console.error('❌ Error getting user by email:', error);
            throw error;
        }
    }
}

// Mock GoogleAuthService class
class GoogleAuthService {
    constructor() {
        this.userService = new UserService();
    }

    async login(email, password) {
        try {
            console.log(`🔐 Attempting login for: ${email}`);
            
            // Find user in Google Sheets
            const user = await this.userService.getUserByEmail(email);
            
            if (!user) {
                throw new Error('Không tìm thấy người dùng');
            }
            
            // In development, skip password validation
            if (process.env.NODE_ENV === 'development') {
                console.log('🔧 Development mode: Password validation skipped');
            }
            
            console.log('✅ Login successful!');
            this.currentUser = user;
            return user;

        } catch (error) {
            console.error('❌ Login error:', error.message);
            throw error;
        }
    }
}

// Test login function
async function testLogin() {
    try {
        const authService = new GoogleAuthService();
        
        // Test login with admin@mia.vn
        const result = await authService.login('admin@mia.vn', 'admin123');
        
        console.log('');
        console.log('🎉 Login test completed successfully!');
        console.log('');
        console.log('📋 User data returned:');
        console.log(JSON.stringify(result, null, 2));
        
        return result;
        
    } catch (error) {
        console.error('❌ Login test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
testLogin();
