/**
 * Configuration file for Google Ads to Google Sheets Integration
 * 
 * Instructions:
 * 1. Copy this file to your Google Apps Script project
 * 2. Update the values below with your actual information
 * 3. Save the file
 * 4. Run the setup() function in the main script
 */

// =============================================================================
// REQUIRED CONFIGURATION - Update these values
// =============================================================================

// Your Google Sheets URL (replace with your actual sheet URL)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Fm27WvBokQqP_qguexymNhCQnzGN4cXL_f6pnv82oPU/edit?usp=sharing';

// Your Google Ads Customer ID (10-digit number, no dashes)
const CUSTOMER_ID = '1234567890';

// Your Google Ads Developer Token
const DEVELOPER_TOKEN = 'YOUR_DEVELOPER_TOKEN_HERE';

// =============================================================================
// OPTIONAL CONFIGURATION - You can modify these as needed
// =============================================================================

// Number of days to pull data for (default: 30 days)
const DATE_RANGE_DAYS = 30;

// Google Ads API version (usually keep as 'v16')
const API_VERSION = 'v16';

// Sheet names for different data types
const SHEET_NAMES = {
  CAMPAIGNS: 'Campaign Data',
  AD_GROUPS: 'Ad Group Data', 
  KEYWORDS: 'Keyword Data',
  SUMMARY: 'Summary'
};

// Time to run the daily trigger (24-hour format)
const TRIGGER_HOUR = 9; // 9 AM

// =============================================================================
// ADVANCED CONFIGURATION - Only modify if you know what you're doing
// =============================================================================

// Whether to clear existing data before writing new data
const CLEAR_EXISTING_DATA = true;

// Whether to send error notifications via email
const SEND_ERROR_NOTIFICATIONS = false;

// Email address for error notifications (if enabled)
const ERROR_NOTIFICATION_EMAIL = 'your-email@example.com';

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

// Export the configuration object
const CONFIG = {
  SHEET_URL: SHEET_URL,
  CUSTOMER_ID: CUSTOMER_ID,
  DATE_RANGE_DAYS: DATE_RANGE_DAYS,
  DEVELOPER_TOKEN: DEVELOPER_TOKEN,
  API_VERSION: API_VERSION,
  SHEET_NAMES: SHEET_NAMES,
  TRIGGER_HOUR: TRIGGER_HOUR,
  CLEAR_EXISTING_DATA: CLEAR_EXISTING_DATA,
  SEND_ERROR_NOTIFICATIONS: SEND_ERROR_NOTIFICATIONS,
  ERROR_NOTIFICATION_EMAIL: ERROR_NOTIFICATION_EMAIL
};

// Validation function
function validateConfig() {
  const errors = [];
  
  if (!CONFIG.SHEET_URL || CONFIG.SHEET_URL.includes('YOUR_SHEET_ID_HERE')) {
    errors.push('SHEET_URL must be updated with your actual Google Sheets URL');
  }
  
  if (!CONFIG.CUSTOMER_ID || CONFIG.CUSTOMER_ID === '1234567890') {
    errors.push('CUSTOMER_ID must be updated with your actual Google Ads Customer ID');
  }
  
  if (!CONFIG.DEVELOPER_TOKEN || CONFIG.DEVELOPER_TOKEN === 'YOUR_DEVELOPER_TOKEN_HERE') {
    errors.push('DEVELOPER_TOKEN must be updated with your actual Google Ads Developer Token');
  }
  
  if (errors.length > 0) {
    throw new Error('Configuration errors found:\n' + errors.join('\n'));
  }
  
  return true;
}

// Make CONFIG available to other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} 