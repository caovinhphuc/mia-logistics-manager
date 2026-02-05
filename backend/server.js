#!/usr/bin/env node

/**
 * MIA Logistics Manager - Backend Server
 * Express server for API and Google Sheets integration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3100;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Google Sheets API endpoints (placeholder)
app.post('/api/sheets/read', (req, res) => {
  const { spreadsheetId, sheetName, range } = req.body;

  console.log(`📖 Reading sheet: ${sheetName} from spreadsheet: ${spreadsheetId}`);

  // Implement Google Sheets read logic here
  res.json({
    success: true,
    values: [],
    message: 'Sheet read endpoint - implement Google Sheets API integration',
  });
});

app.post('/api/sheets/append', (req, res) => {
  const { spreadsheetId, sheetName, values } = req.body;

  console.log(`✍️  Appending to sheet: ${sheetName}`);

  res.json({
    success: true,
    message: 'Data appended successfully',
    rowsAdded: values.length,
  });
});

app.post('/api/sheets/update', (req, res) => {
  const { spreadsheetId, sheetName } = req.body;

  console.log(`🔄 Updating sheet: ${sheetName}`);

  res.json({
    success: true,
    message: 'Data updated successfully',
  });
});

app.post('/api/sheets/delete', (req, res) => {
  const { spreadsheetId, sheetName } = req.body;

  console.log(`🗑️  Deleting from sheet: ${sheetName}`);

  res.json({
    success: true,
    message: 'Data deleted successfully',
  });
});

app.post('/api/sheets/create-sheet', (req, res) => {
  const { spreadsheetId, sheetName, data } = req.body;

  console.log(`✨ Creating sheet: ${sheetName}`);

  res.json({
    success: true,
    sheetName,
    rowsAdded: (data || []).length - 1,
    columns: data && data[0] ? data[0].length : 0,
  });
});

// User authentication endpoints (placeholder)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log(`🔐 Login attempt: ${email}`);

  res.json({
    success: true,
    message: 'Login endpoint - implement authentication logic',
    user: { email },
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 MIA Logistics Manager Backend Server');
  console.log('========================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/health           - Health check');
  console.log('  GET  /api/status           - Server status');
  console.log('  POST /api/sheets/*         - Google Sheets operations');
  console.log('  POST /api/auth/*           - Authentication endpoints');
  console.log('');
});

module.exports = app;
