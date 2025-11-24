/**
 * Wrapper for fyers-api-v3 to avoid bundling issues
 * This file is plain JavaScript and only loads what we need
 *
 * We bypass the main index.js which loads problematic websocket modules
 * and directly load only the REST API service we actually use.
 */

let FyersApi;

try {
  // Directly load just the API service module, bypassing the main index.js
  // which attempts to load websocket modules with obfuscated code
  FyersApi = require('fyers-api-v3/apiService/apiService.js');
} catch (e) {
  console.error('Failed to load fyers-api-v3 API service:', e);
  throw new Error('Unable to load Fyers API service. Please check the fyers-api-v3 package installation.');
}

module.exports = { FyersApi };
