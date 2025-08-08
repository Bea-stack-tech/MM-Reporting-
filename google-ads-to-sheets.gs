/**
 * Google Ads to Google Sheets Integration
 * This script automatically pulls Google Ads metrics and populates a Google Sheets
 * 
 * Setup Instructions:
 * 1. Create a new Google Apps Script project
 * 2. Copy this code into the script editor
 * 3. Replace the SHEET_URL with your actual Google Sheets URL
 * 4. Set up OAuth2 authentication for Google Ads API
 * 5. Create a trigger to run this script automatically
 */

// Configuration - Update these values
const SHEET_URL = 'YOUR_GOOGLE_SHEETS_URL_HERE'; // Replace with your actual sheet URL
const CUSTOMER_ID = 'YOUR_GOOGLE_ADS_CUSTOMER_ID'; // Replace with your customer ID
const DATE_RANGE_DAYS = 30; // Number of days to pull data for

// Google Ads API configuration
const GOOGLE_ADS_API_VERSION = 'v16';

/**
 * Main function to pull Google Ads data and populate sheets
 */
function pullGoogleAdsData() {
  try {
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openByUrl(SHEET_URL);
    const sheet = spreadsheet.getActiveSheet();
    
    // Clear existing data (optional - comment out if you want to append)
    clearExistingData(sheet);
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - DATE_RANGE_DAYS);
    
    // Pull Google Ads data
    const adsData = getGoogleAdsData(startDate, endDate);
    
    // Write data to sheet
    writeDataToSheet(sheet, adsData);
    
    // Log success
    console.log('Successfully pulled and wrote Google Ads data to sheet');
    
  } catch (error) {
    console.error('Error in pullGoogleAdsData:', error);
    throw error;
  }
}

/**
 * Get Google Ads data using the Google Ads API
 */
function getGoogleAdsData(startDate, endDate) {
  try {
    // Format dates for API
    const startDateStr = Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const endDateStr = Utilities.formatDate(endDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    
    // Google Ads Query Language (GAQL) query
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.average_cpc,
        metrics.ctr,
        metrics.average_cpm,
        metrics.conversions_from_interactions_rate,
        segments.date
      FROM campaign
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
      ORDER BY segments.date DESC
    `;
    
    // Make API request
    const response = makeGoogleAdsApiRequest(query);
    
    return processApiResponse(response);
    
  } catch (error) {
    console.error('Error getting Google Ads data:', error);
    throw error;
  }
}

/**
 * Make request to Google Ads API
 */
function makeGoogleAdsApiRequest(query) {
  try {
    const url = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${CUSTOMER_ID}/googleAds:searchStream`;
    
    const payload = {
      query: query
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ScriptApp.getOAuthToken()}`,
        'Content-Type': 'application/json',
        'developer-token': 'YOUR_DEVELOPER_TOKEN' // Replace with your developer token
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
    
  } catch (error) {
    console.error('Error making Google Ads API request:', error);
    throw error;
  }
}

/**
 * Process the API response
 */
function processApiResponse(response) {
  const processedData = [];
  
  if (response.results) {
    response.results.forEach(result => {
      const row = {
        date: result.segments?.date || '',
        campaignId: result.campaign?.id || '',
        campaignName: result.campaign?.name || '',
        adGroupId: result.adGroup?.id || '',
        adGroupName: result.adGroup?.name || '',
        impressions: result.metrics?.impressions || 0,
        clicks: result.metrics?.clicks || 0,
        cost: (result.metrics?.costMicros || 0) / 1000000, // Convert micros to actual cost
        conversions: result.metrics?.conversions || 0,
        averageCpc: (result.metrics?.averageCpc || 0) / 1000000,
        ctr: result.metrics?.ctr || 0,
        averageCpm: (result.metrics?.averageCpm || 0) / 1000000,
        conversionRate: result.metrics?.conversionsFromInteractionsRate || 0
      };
      processedData.push(row);
    });
  }
  
  return processedData;
}

/**
 * Write data to Google Sheets
 */
function writeDataToSheet(sheet, data) {
  try {
    if (data.length === 0) {
      console.log('No data to write');
      return;
    }
    
    // Prepare headers
    const headers = [
      'Date',
      'Campaign ID',
      'Campaign Name',
      'Ad Group ID',
      'Ad Group Name',
      'Impressions',
      'Clicks',
      'Cost',
      'Conversions',
      'Average CPC',
      'CTR',
      'Average CPM',
      'Conversion Rate'
    ];
    
    // Prepare data rows
    const dataRows = data.map(row => [
      row.date,
      row.campaignId,
      row.campaignName,
      row.adGroupId,
      row.adGroupName,
      row.impressions,
      row.clicks,
      row.cost,
      row.conversions,
      row.averageCpc,
      row.ctr,
      row.averageCpm,
      row.conversionRate
    ]);
    
    // Write headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // Write data
    const startRow = sheet.getLastRow() + 1;
    if (dataRows.length > 0) {
      sheet.getRange(startRow, 1, dataRows.length, headers.length).setValues(dataRows);
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    console.log(`Successfully wrote ${dataRows.length} rows to sheet`);
    
  } catch (error) {
    console.error('Error writing data to sheet:', error);
    throw error;
  }
}

/**
 * Clear existing data from sheet
 */
function clearExistingData(sheet) {
  try {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) { // Keep headers
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
    }
  } catch (error) {
    console.error('Error clearing existing data:', error);
  }
}

/**
 * Set up automatic trigger to run daily
 */
function createDailyTrigger() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'pullGoogleAdsData') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new daily trigger
  ScriptApp.newTrigger('pullGoogleAdsData')
    .timeBased()
    .everyDays(1)
    .atHour(9) // Run at 9 AM
    .create();
    
  console.log('Daily trigger created successfully');
}

/**
 * Manual function to test the script
 */
function testScript() {
  console.log('Starting test run...');
  pullGoogleAdsData();
  console.log('Test run completed');
}

/**
 * Setup function - run this once to configure the script
 */
function setup() {
  // Create daily trigger
  createDailyTrigger();
  
  // Test the script
  testScript();
  
  console.log('Setup completed successfully');
} 