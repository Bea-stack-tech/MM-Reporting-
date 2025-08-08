/**
 * Google Ads Scripts Debug Version - No Developer Token Required
 * This script helps debug why metrics might be showing as 0 or missing
 * 
 * Setup Instructions:
 * 1. Go to Google Ads Scripts: https://ads.google.com/um/Welcome/Home?subid=us-en-et-g-aw-a-googleads!o3~#Scripts
 * 2. Create a new script
 * 3. Copy this code into the script editor
 * 4. Save and run the script
 */

// Configuration - Update these values
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/19rQ9zO5id6W6hAVW5hnm_8qNSEiLcWmqQQLq3w_hDSA/edit?gid=0#gid=0';
const DATE_RANGE_DAYS = 7; // Reduced to 7 days for testing

/**
 * Main function to debug Google Ads data
 */
function main() {
  try {
    console.log('Starting Google Ads debug...');
    
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openByUrl(SHEET_URL);
    const sheet = getOrCreateSheet(spreadsheet, 'Debug Data');
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - DATE_RANGE_DAYS);
    
    console.log(`Debugging data from ${startDate.toDateString()} to ${endDate.toDateString()}`);
    
    // Clear the debug sheet
    sheet.clear();
    
    // Write headers
    const headers = ['Type', 'ID', 'Name', 'Status', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'CTR', 'CPC'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    let rowIndex = 2;
    
    // Debug campaigns
    console.log('Debugging campaigns...');
    const campaignIterator = AdsApp.campaigns().get();
    let campaignCount = 0;
    
    while (campaignIterator.hasNext()) {
      const campaign = campaignIterator.next();
      campaignCount++;
      
      try {
        const stats = campaign.getStatsFor(startDate, endDate);
        
        const row = [
          'Campaign',
          campaign.getId(),
          campaign.getName(),
          campaign.getStatus(),
          stats.getImpressions() || 0,
          stats.getClicks() || 0,
          stats.getCost() || 0,
          stats.getConversions() || 0,
          stats.getCtr() || 0,
          stats.getAverageCpc() || 0
        ];
        
        sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
        rowIndex++;
        
        console.log(`Campaign: ${campaign.getName()} - Impressions: ${stats.getImpressions()}, Clicks: ${stats.getClicks()}, Cost: ${stats.getCost()}`);
        
      } catch (error) {
        console.error(`Error with campaign ${campaign.getName()}:`, error);
        const errorRow = [
          'Campaign (ERROR)',
          campaign.getId(),
          campaign.getName(),
          campaign.getStatus(),
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR'
        ];
        sheet.getRange(rowIndex, 1, 1, headers.length).setValues([errorRow]);
        rowIndex++;
      }
    }
    
    console.log(`Processed ${campaignCount} campaigns`);
    
    // Debug ad groups
    console.log('Debugging ad groups...');
    const adGroupIterator = AdsApp.adGroups().get();
    let adGroupCount = 0;
    
    while (adGroupIterator.hasNext()) {
      const adGroup = adGroupIterator.next();
      adGroupCount++;
      
      try {
        const stats = adGroup.getStatsFor(startDate, endDate);
        
        const row = [
          'Ad Group',
          adGroup.getId(),
          adGroup.getName(),
          adGroup.getStatus(),
          stats.getImpressions() || 0,
          stats.getClicks() || 0,
          stats.getCost() || 0,
          stats.getConversions() || 0,
          stats.getCtr() || 0,
          stats.getAverageCpc() || 0
        ];
        
        sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
        rowIndex++;
        
      } catch (error) {
        console.error(`Error with ad group ${adGroup.getName()}:`, error);
        const errorRow = [
          'Ad Group (ERROR)',
          adGroup.getId(),
          adGroup.getName(),
          adGroup.getStatus(),
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR',
          'ERROR'
        ];
        sheet.getRange(rowIndex, 1, 1, headers.length).setValues([errorRow]);
        rowIndex++;
      }
    }
    
    console.log(`Processed ${adGroupCount} ad groups`);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('Debug completed successfully');
    
  } catch (error) {
    console.error('Error in main:', error);
    throw error;
  }
}

/**
 * Get or create a sheet
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    console.log(`Created new sheet: ${sheetName}`);
  }
  return sheet;
}

/**
 * Format date for Google Ads API
 */
function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/**
 * Manual function to test the script
 */
function testScript() {
  console.log('Starting debug test run...');
  main();
  console.log('Debug test run completed');
} 