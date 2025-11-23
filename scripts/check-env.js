#!/usr/bin/env node

/**
 * Environment Variables Checker
 * Validates that all required environment variables are set
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_VARS = [
  'FYERS_APP_ID',
  'FYERS_SECRET_KEY',
  'FYERS_REDIRECT_URI',
  'NEXT_PUBLIC_APP_URL',
  'SESSION_SECRET',
];

const OPTIONAL_VARS = ['FYERS_API_BASE_URL'];

function checkEnvironment() {
  console.log('\n🔍 Checking Zentrade Environment Configuration...\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.log('\n💡 Create one by running:');
    console.log('   cp .env.example .env.local\n');
    process.exit(1);
  }

  // Load environment variables
  require('dotenv').config({ path: envPath });

  let hasErrors = false;
  const warnings = [];

  // Check required variables
  console.log('Required Environment Variables:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  REQUIRED_VARS.forEach((varName) => {
    const value = process.env[varName];
    const isSet = value && value.trim() !== '' && !value.includes('your_');

    if (isSet) {
      console.log(`✅ ${varName}`);
      // Show partial value for verification
      if (varName === 'FYERS_APP_ID' && value.length > 8) {
        console.log(`   ${value.substring(0, 8)}...`);
      } else if (varName === 'FYERS_REDIRECT_URI') {
        console.log(`   ${value}`);
      } else if (varName === 'NEXT_PUBLIC_APP_URL') {
        console.log(`   ${value}`);
      }
    } else {
      console.log(`❌ ${varName} - NOT SET OR USING PLACEHOLDER`);
      hasErrors = true;
    }
  });

  // Check optional variables
  console.log('\n\nOptional Environment Variables:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  OPTIONAL_VARS.forEach((varName) => {
    const value = process.env[varName];
    const isSet = value && value.trim() !== '';

    if (isSet) {
      console.log(`✅ ${varName}`);
      console.log(`   ${value}`);
    } else {
      console.log(`⚠️  ${varName} - Not set (using default)`);
      warnings.push(`${varName} will use default value`);
    }
  });

  // Validation checks
  console.log('\n\nValidation Checks:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check redirect URI format
  const redirectUri = process.env.FYERS_REDIRECT_URI;
  if (redirectUri) {
    if (redirectUri.includes('/api/fyers/callback')) {
      console.log('✅ Redirect URI format is correct');
    } else {
      console.log('⚠️  Redirect URI should end with /api/fyers/callback');
      warnings.push('Redirect URI format might be incorrect');
    }
  }

  // Check session secret length
  const sessionSecret = process.env.SESSION_SECRET;
  if (sessionSecret && sessionSecret.length >= 32) {
    console.log('✅ Session secret is strong');
  } else if (sessionSecret) {
    console.log('⚠️  Session secret should be at least 32 characters');
    warnings.push('Session secret is too short');
  }

  // Check API base URL
  const apiBaseUrl = process.env.FYERS_API_BASE_URL;
  if (apiBaseUrl) {
    if (apiBaseUrl.includes('api-t1.fyers.in')) {
      console.log('✅ Using Paper Trading environment (safe for testing)');
    } else if (apiBaseUrl.includes('api.fyers.in')) {
      console.log('⚠️  Using LIVE Trading environment - real money!');
      warnings.push('Live trading environment active');
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(50));
  console.log('Summary');
  console.log('='.repeat(50) + '\n');

  if (hasErrors) {
    console.log('❌ Configuration has errors! Please fix the issues above.\n');
    console.log('📖 Refer to SETUP.md for detailed instructions.\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log('⚠️  Configuration has warnings:\n');
    warnings.forEach((warning) => {
      console.log(`   • ${warning}`);
    });
    console.log('');
  }

  console.log('✅ All required environment variables are set!');
  console.log('\n🚀 You can now run: pnpm dev\n');
}

// Run the check
try {
  checkEnvironment();
} catch (error) {
  console.error('\n❌ Error checking environment:', error.message);
  process.exit(1);
}
